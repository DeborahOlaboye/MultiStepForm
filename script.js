document.addEventListener("DOMContentLoaded", function () {
    const steps = document.querySelectorAll(".form-container");
    // console.log(steps);
    const nextButtons = document.querySelectorAll(".next");
    // console.log(nextButtons);
    const prevButtons = document.querySelectorAll(".back");
    const toggleSwitch = document.querySelector(".toggle-switch");
    const monthlyPlan = document.getElementById("monthly");
    const yearlyPlan = document.getElementById("yearly");
    const togglePricing = document.getElementById("togglePricing");
    const prices = document.querySelectorAll(".price");
    let selectedPlan = ""
    let selectedPlanPrice = 0
    let selectedAddons = []
  
    let currentStep = 0;
  
    function showStep(stepIndex) {
    //   console.log(`Showing step: ${stepIndex}`);
      
      steps.forEach((step, index) => {
        step.style.display = index === stepIndex ? "block" : "none";
        // console.log(`Step ${index + 1}: ${index === stepIndex ? "Visible" : "Hidden"}`);
      });
  
      // Hide Next button on the last step
      nextButtons.forEach(button => {
        button.style.display = stepIndex === steps.length - 1 ? "none" : "inline-block";
      });
  
      // Hide Previous button on the first step
      prevButtons.forEach(button => {
        button.style.display = stepIndex === 0 ? "none" : "inline-block";
      });
    }
  
    nextButtons.forEach(button => {
      button.addEventListener("click", function () {
        if (currentStep < steps.length - 1) {
          currentStep++;
          showStep(currentStep);
        //   updatePricing();
        }
      });
    });
  
    prevButtons.forEach(button => {
      button.addEventListener("click", function () {
        if (currentStep > 0) {
          currentStep--;
          showStep(currentStep);
        }
      });
    });

    // Ensure Previous button is hidden at the start
    prevButtons.forEach(button => {
        button.style.display = "none";
      });
  
    // Initially show the monthly plan
    yearlyPlan.style.display = "none";
    monthlyPlan.style.display = "flex";

    toggleSwitch.addEventListener("click", function () {
        if (monthlyPlan.style.display === "none") {
            monthlyPlan.style.display = "flex";
            yearlyPlan.style.display = "none";
            localStorage.setItem("selectedPlan", "monthly");
        } else {
            monthlyPlan.style.display = "none";
            yearlyPlan.style.display = "flex";
            localStorage.setItem("selectedPlan", "yearly");
        }

        toggleSwitch.classList.toggle("active");
        // updatePricing();
    });

    // Plan pricing
    const planPrices = {
        monthly: { Arcade: 9, Advanced: 12, Pro: 15 },
        yearly: { Arcade: 90, Advanced: 120, Pro: 150 }
    };

    // Function to handle plan selection
    function selectPlan(plans) {
        plans.forEach(plan => {
            plan.addEventListener("click", function () {
                // Remove 'selected' class from all plans
                plans.forEach(p => p.classList.remove("selected"));

                // Add 'selected' class to the clicked plan
                this.classList.add("selected");

                // Store selected plan
                selectedPlan = this.querySelector("h4").innerText;
                console.log("Selected Plan:", selectedPlan);

                // Determine pricing based on selection
                const planType = isYearly ? "yearly" : "monthly";
                selectedPlanPrice = planPrices[planType][selectedPlan]; // Set price
                console.log(selectedPlanPrice);
                updateSummary();
            });
        });
    }
    
    // Select plans for both monthly and yearly options
    selectPlan(document.querySelectorAll("#monthly .plan"), "monthly");
    selectPlan(document.querySelectorAll("#yearly .plan"), "yearly");

    

    const addonElements = document.querySelectorAll(".addon");
    const planElements = document.querySelectorAll(".plan");

    // Add-on pricing
    const addonPrices = {
        monthly: { "Online service": 1, "Larger storage": 2, "Customizable Profile": 2 },
        yearly: { "Online service": 10, "Larger storage": 20, "Customizable Profile": 20 }
    };

     // Check if the user selected yearly pricing in the previous step
    //  const isYearly = localStorage.getItem("selectedPlan") === "yearly";
    let isYearly = false;

    // Function to update add-on prices
    function updateAddonPricing() {
        addonElements.forEach(addon => {
            const addonName = addon.querySelector("h5").innerText;
            // console.log(addonName);
            if (addon.classList.contains("selected")) {
                selectedAddons = selectedAddons.filter(item => item !== addonName);
            } else {
                selectedAddons.push(addonName);
            }
            addon.classList.toggle("selected");
            updateSummary();
            const priceSpan = addon.querySelector(".price");

            if (isYearly) {
                priceSpan.textContent = `+$${addonPrices.yearly[addonName]}/yr`;
            } else {
                priceSpan.textContent = `+$${addonPrices.monthly[addonName]}/mo`;
            }
        });
    }
     // Ensure all add-ons are unselected on page load
     addonElements.forEach(addon => {
        addon.classList.remove("selected"); // Remove 'selected' class on load
    });

    addonElements.forEach(addon => {
        addon.addEventListener("click", function () {
            const addonName = this.querySelector("h5").innerText;
            
            if (this.classList.contains("selected")) {
                // Remove add-on if already selected
                selectedAddons = selectedAddons.filter(item => item !== addonName);
            } else {
                // Add add-on if not selected
                selectedAddons.push(addonName);
            }

            this.classList.toggle("selected"); // Toggle UI
            updateSummary(); // Update prices
        });
    });

    

    function updatePlanPricing() {
        planElements.forEach(plan => {
            const planName = plan.querySelector("h5").innerText;
            // console.log(planName);
            const priceSpan = plan.querySelector(".price");

            if (isYearly) {
                priceSpan.textContent = `+$${planPrices.yearly[planName]}/yr`;
            } else {
                priceSpan.textContent = `+$${planPrices.monthly[planName]}/mo`;
            }
        });
    }

   
    function updateSummary() {
        // Update plan name and price
        document.getElementById("plan-name").innerText = `${selectedPlan} (${isYearly ? "Yearly" : "Monthly"})`;
        document.getElementById("plan-price").innerText = `$${selectedPlanPrice}/${isYearly ? "yr" : "mo"}`;

        // Update selected add-ons
        let addonsList = document.getElementById("add-ons-list");
        addonsList.innerHTML = "";
        let totalAddonsPrice = 0;

        selectedAddons.forEach(addon => {
            let price = isYearly ? addonPrices.yearly[addon] : addonPrices.monthly[addon];
            totalAddonsPrice += price;
            addonsList.innerHTML += `<p>${addon} <span class="price">+$${price}/${isYearly ? "yr" : "mo"}</span></p>`;
        });

        // Update total price
        let totalPrice = selectedPlanPrice + totalAddonsPrice;
        document.getElementById("total-price").innerText = `$${totalPrice}/${isYearly ? "yr" : "mo"}`;
    }

     // Toggle event for switching between monthly and yearly
     toggleSwitch.addEventListener("click", function () {
        isYearly = !isYearly; // Toggle the plan type
        updateAddonPricing(); // Update add-ons pricing
        updatePlanPricing();
        updateSummary();
    });
     // Initialize pricing display on page load
    showStep(currentStep);
    updateSummary();
  });
  