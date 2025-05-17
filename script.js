document.addEventListener('DOMContentLoaded', function() {
    const mainBusinessUnit = document.getElementById('main_business_unit');
    const sectionAmerEmeaApac = document.getElementById('section_amer_emea_apac');
    const sectionGps = document.getElementById('section_gps');
    const regionAmerEmeaApac = document.getElementById('region_amer_emea_apac');
    const regionGps = document.getElementById('region_gps');

    const campaignTypeSelect = document.getElementById('campaign_type');
    const subTypeContainer = document.getElementById('sub_type_section_container');
    const allSubTypeGroups = document.querySelectorAll('.sub_type_options');

    mainBusinessUnit.addEventListener('change', function() {
        const selectedValue = this.value;
        sectionAmerEmeaApac.style.display = 'none';
        regionAmerEmeaApac.required = false;
        sectionGps.style.display = 'none';
        regionGps.required = false;

        if (['AMER', 'EMEA', 'APAC'].includes(selectedValue)) {
            sectionAmerEmeaApac.style.display = 'block';
            regionAmerEmeaApac.required = true;
        } else if (selectedValue === 'GPS') {
            sectionGps.style.display = 'block';
            regionGps.required = true;
        }
    });

    campaignTypeSelect.addEventListener('change', function() {
        const selectedCampaignType = this.value;
        
        allSubTypeGroups.forEach(group => {
            group.style.display = 'none';
        });

        if (selectedCampaignType) {
            subTypeContainer.style.display = 'block';
            let subTypeId = '';

            if (selectedCampaignType === "Paid Social") subTypeId = "sub_type_paid_social";
            else if (selectedCampaignType === "Paid Search") subTypeId = "sub_type_paid_search";
            else if (selectedCampaignType === "Paid Display") subTypeId = "sub_type_paid_display";
            else if (selectedCampaignType === "Tradeshow/Events") subTypeId = "sub_type_tradeshow_events";
            else if (selectedCampaignType === "Calling") subTypeId = "sub_type_calling";
            else if (selectedCampaignType === "Organic Social") subTypeId = "sub_type_organic_social";
            else if (selectedCampaignType === "Offline Promotions") subTypeId = "sub_type_offline_promotions";
            else if (selectedCampaignType === "Public Relations") subTypeId = "sub_type_public_relations";
            else if (selectedCampaignType === "Email") subTypeId = "sub_type_email";
            else if (selectedCampaignType === "Digital Event") subTypeId = "sub_type_digital_event";
            else if (selectedCampaignType === "Sponsorship") subTypeId = "sub_type_sponsorship";
            else if (selectedCampaignType === "Strategic Campaign") subTypeId = "sub_type_strategic_campaign";
            else if (selectedCampaignType === "Sales Enablement") subTypeId = "sub_type_sales_enablement";
            else if (selectedCampaignType === "Website") subTypeId = "sub_type_website";
            
            
            if (subTypeId) {
                const targetSubTypeGroup = document.getElementById(subTypeId);
                if (targetSubTypeGroup) {
                    targetSubTypeGroup.style.display = 'flex'; 
                }
            }
        } else {
            subTypeContainer.style.display = 'none';
        }
    });

    const dataForm = document.getElementById('data_form');
    if (dataForm) {
        dataForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            
            let formIsValid = true;
            
            const requiredInputs = dataForm.querySelectorAll('[required]');
            requiredInputs.forEach(input => {
                if ( (input.type === 'text' || input.type === 'date' || input.type === 'number' || input.tagName === 'TEXTAREA') && !input.value.trim()) {
                    formIsValid = false;
                } else if (input.tagName === 'SELECT' && !input.value) {
                    formIsValid = false;
                }
            });

            const domainAmerEmeaApacChecked = Array.from(dataForm.querySelectorAll('input[name="domain_amer_emea_apac[]"]:checked')).length > 0;
            const domainGpsChecked = Array.from(dataForm.querySelectorAll('input[name="domain_gps[]"]:checked')).length > 0;


            if (sectionAmerEmeaApac.style.display === 'block' && !domainAmerEmeaApacChecked) {
                 formIsValid = false;
                 console.log("Validation: At least one Domain checkbox must be selected for AMER/EMEA/APAC.");
            }
             if (sectionGps.style.display === 'block' && !domainGpsChecked) {
                 formIsValid = false;
                 console.log("Validation: At least one Domain checkbox must be selected for GPS.");
            }


            if (formIsValid) {
                // console.log('--- Form Data ---');
                const formData = new FormData(dataForm);
                let consoleOutput = {};

                for (let [key, value] of formData.entries()) {
                    const element = dataForm.elements[key.replace('[]','')]; // Handle array names for checkboxes
                    
                    if (element && element.length && typeof element.forEach === 'function') { // NodeList for checkboxes/radios
                         if (key.endsWith('[]')) {
                            if (!consoleOutput[key.replace('[]','')]) {
                                consoleOutput[key.replace('[]','')] = [];
                            }
                            consoleOutput[key.replace('[]','')].push(value);
                        } else { // Should not happen often with FormData for multiple checkboxes with same name
                             consoleOutput[key] = value;
                        }
                    } else if (element && element.type === 'checkbox') { // Single checkbox not part of a group
                        if (element.checked) {
                           consoleOutput[key] = value;
                        }
                    }
                    else {
                         consoleOutput[key] = value;
                    }
                }
                
                for(const prop in consoleOutput){
                    if(Array.isArray(consoleOutput[prop])){
                        console.log(`${prop}: ${consoleOutput[prop].join(', ')}`);
                    } else {
                        console.log(`${prop}: ${consoleOutput[prop]}`);
                    }
                }

                // console.log('-------------------');
                alert('Form submitted successfully! Check the console for data.');
                dataForm.reset(); 
                sectionAmerEmeaApac.style.display = 'none';
                regionAmerEmeaApac.required = false;
                sectionGps.style.display = 'none';
                regionGps.required = false;
                allSubTypeGroups.forEach(group => { group.style.display = 'none'; });
                subTypeContainer.style.display = 'none';
                
            } else {
                console.log('Form is invalid. Please fill all required fields and ensure domain selections are made if applicable.');
                alert('Please fill all required fields marked with * and ensure domain selections are made where applicable.');
                
                dataForm.reportValidity(); 
            }
        });
    }
});