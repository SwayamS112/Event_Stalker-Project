let but = document.querySelector("#btn");
but.addEventListener("click",()=>{
    
    alert("Mode Changed");
    
    console.log("button is clicked");
    
    document.body.classList.toggle("dark-mode"); // css used
    
    if (document.body.classList.contains("dark-mode")) {
        btn.textContent = "Change to Light";
    } else {
        btn.textContent = "Change to Dark";
    }
});