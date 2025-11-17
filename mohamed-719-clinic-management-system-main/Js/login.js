    document.getElementById("facebook").onmouseover = function() {
        this.style.scale = "1.1";
    };
    document.getElementById("facebook").onmouseout = function() {
        this.style.scale = "1";
    };
    document.getElementById("email").onmouseover = function() {
        this.style.scale = "1.1";
    };
    document.getElementById("email").onmouseout = function() {
        this.style.scale = "1";
    };
     document.getElementById("password").onmouseover = function() {
        this.style.scale = "1.1";
    };
    document.getElementById("password").onmouseout = function() {
        this.style.scale = "1";
    };
     document.getElementById("sub").onmouseover = function() {
        this.style.scale = "1.1";
    };
    document.getElementById("sub").onmouseout = function() {
        this.style.scale = "1";
    };
    document.getElementById("welcome").onmouseover = function() {
        this.style.scale = "1.1" , this.style.color = "#007bff";
    };
    document.getElementById("welcome").onmouseout = function() {
        this.style.scale = "1" , this.style.color = "black";
    };

    document.getElementById("facebook").onclick = function() 
    {
        window.open("https://www.facebook.com" , "_blank");
    };

    document.getElementById("login-form").addEventListener("submit", async function(eve){
    eve.preventDefault();
    
    let email = document.getElementById("email").value.trim();
    //localStorage.setItem("email", email);
    let password = document.getElementById("password").value.trim();
    //localStorage.setItem("password", password);

    try {
        let res = await fetch("http://localhost:3000/users");
        let users = await res.json();

        let user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem("patient-id" , user.id);
            localStorage.setItem("email", user.email);
            localStorage.setItem("username", user.name);
            alert("Welcome " + user.name);
            window.location.href = "index.html";
        } else {
            alert("Wrong Email or Password");
        }
    } catch (err) {
        console.error("Error:", err);
        alert("error");
    }
});