
document.getElementById("facebook").onmouseover = function () { this.style.scale = "1.1"; };
document.getElementById("facebook").onmouseout = function () { this.style.scale = "1"; };
document.getElementById("fullName").onmouseover = function () { this.style.scale = "1.1"; };
document.getElementById("fullName").onmouseout = function () { this.style.scale = "1"; };
document.getElementById("phone").onmouseover = function () { this.style.scale = "1.1"; };
document.getElementById("phone").onmouseout = function () { this.style.scale = "1"; };
document.getElementById("email").onmouseover = function () { this.style.scale = "1.1"; };
document.getElementById("email").onmouseout = function () { this.style.scale = "1"; };
document.getElementById("gender").onmouseover = function () { this.style.scale = "1.1"; };
document.getElementById("gender").onmouseout = function () { this.style.scale = "1"; };
document.getElementById("password").onmouseover = function () { this.style.scale = "1.1"; };
document.getElementById("password").onmouseout = function () { this.style.scale = "1"; };
document.getElementById("rep-password").onmouseover = function () { this.style.scale = "1.1"; };
document.getElementById("rep-password").onmouseout = function () { this.style.scale = "1"; };
document.getElementById("sub").onmouseover = function () { this.style.scale = "1.1"; };
document.getElementById("sub").onmouseout = function () { this.style.scale = "1"; };
document.getElementById("dob").onmouseover = function () { this.style.scale = "1.1"; };
document.getElementById("dob").onmouseout = function () { this.style.scale = "1"; };
document.getElementById("facebook").onclick = function () {
  window.open("https://www.facebook.com", "_blank");
};

let name = document.getElementById("fullName");
let nameError = document.getElementById("name-error");
let phone = document.getElementById("phone");
let phoneError = document.getElementById("phone-error");
let email = document.getElementById("email");
let emailError = document.getElementById("email-error");
let gender = document.getElementById("gender");
let gendererror = document.getElementById("gender-error");
let dob = document.getElementById("dob");
let doberror = document.getElementById("dob-error");
let password = document.getElementById("password");
let passwordError = document.getElementById("password-error");
let repPassword = document.getElementById("rep-password");
let repPasswordError = document.getElementById("rep-password-error");

// Validation


//بيعمل فالديت علي الاسم
function validateName(eve) {
  if (name.value.length < 8) {
    nameError.style.display = 'block';
    eve.preventDefault();
    error.style.size = '1px';
    return false;
  }
  else {
    nameError.style.display = 'none';
    return true;
  }
}

//بيعمل فالديت علي رقم التليفون
function validatePhone(eve) {
  phonePattern = /^\+20\d{10}$/;
  if (!phonePattern.test(phone.value)) {
    phoneError.style.display = 'block';
    eve.preventDefault();
    return false;
  } else {
    phoneError.style.display = 'none';
    return true;
  }
}
// بيعمل فالديت علي الايميل
function validateEmail(eve) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value)) {
    emailError.style.display = 'block';
    eve.preventDefault();
    return false;
  } else {
    emailError.style.display = 'none';
    return true;
  }
}
// بيعمل فالديت ع الجندر
function validateGender(eve) {
  if (gender.value === "") {
    gendererror.style.display = 'block';
    eve.preventDefault();
    return false;
  }
  else {
    gendererror.style.display = 'none';
    return true;
  }
}


//بيعمل فالديت علي التاريخ
function validateDob(eve) {
  const today = new Date();
  const dobDate = new Date(dob.value);
  const datepattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
  if (dob.value === "" || !datepattern.test(dob.value) || dobDate >= today) {
    doberror.style.display = 'block';
    eve.preventDefault();
    return false;
  }
  else {
    doberror.style.display = 'none';
    return true;
  }
}

//بيعمل فالديت ع الباسورد
function validatePassword(eve) {
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordPattern.test(password.value)) {
    passwordError.style.display = 'block';
    eve.preventDefault();
    return false;
  } else {
    passwordError.style.display = 'none';
    return true;
  }
}
//بيعمل فالديت ع ريبيت الباسورد

function validateRepPassword(eve) {
  if (repPassword.value !== password.value) {
    repPasswordError.style.display = 'block';
    eve.preventDefault();
    return false;
  } else {
    repPasswordError.style.display = 'none';
    return true;
  }
}

//بيعمل فالديت عليهم كلهم عشان ميبعتش الفورم الا لما اليوزر يظبط كل الحقول
function validatAll(e) {
  e.preventDefault();

  if (
    validateName(e) &&
    validatePhone(e) &&
    validateEmail(e) &&
    validateGender(e) &&
    validateDob(e) &&
    validatePassword(e) &&
    validateRepPassword(e)
  ) {
    const user = {
      name: document.getElementById("fullName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      gender: document.getElementById("gender").value,
      birthdate: document.getElementById("dob").value,
      password: document.getElementById("password").value,
      repeatPassword: document.getElementById("rep-password").value,
      bookings: []
    };



    //بيعمل تشيك لو الايميل والرقم موجودين او لا 

    fetch("http://localhost:3000/users")
      .then(res => res.json())
      .then(users => {
        let exists = users.find(
          u => u.email === user.email || u.phone === user.phone
        );

        if (exists) {
          alert("Email already Exists, Please Log In");
        } else {
          fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
          })
            .then(res => res.json())
            .then(data => {
              alert(" User registered successfully!");
              document.getElementById("signup-form").reset();
              console.log("Saved:", data);
            })
            .catch(err => {
              console.error("Error saving user:", err);
              alert("Something went wrong.");
            });
        }
      })
      .catch(err => {
        console.error("Error fetching users:", err);
        alert("Server error.");
      });
  } else {
    alert("Please fix errors before submitting.");
  }
}















/*fetch('http://localhost:3000/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(user)
})
  .then(res => res.json())
  .then(data => {
    alert("User registered successfully!");
    document.getElementById("signup-form").reset();
    console.log("Saved:", data);
  })
  .catch(err => {
    console.error("Error saving user:", err);
    alert("Something went wrong.");
  });
} else {
alert("Please fix errors before submitting.");

}
}

*/