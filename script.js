document.addEventListener("DOMContentLoaded", function () {
    const steps = document.querySelectorAll(".form-container");
    console.log(steps);
    const nextButtons = document.querySelectorAll(".next");
    console.log(nextButtons);
    const prevButtons = document.querySelectorAll(".back");
    const toggleSwitch = document.getElementById("toggle-switch");
    const plans = document.querySelectorAll(".plan");
  
    let currentStep = 0;
  
    function showStep(stepIndex) {
      console.log(`Showing step: ${stepIndex}`);
      
      steps.forEach((step, index) => {
        step.style.display = index === stepIndex ? "block" : "none";
        console.log(`Step ${index + 1}: ${index === stepIndex ? "Visible" : "Hidden"}`);
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
  
    toggleSwitch.addEventListener("change", function () {
      plans.forEach(plan => {
        plan.classList.toggle("yearly");
      });
    });
  
    // Initialize the first step and ensure "Previous" button is hidden initially
    showStep(currentStep);
  });
  