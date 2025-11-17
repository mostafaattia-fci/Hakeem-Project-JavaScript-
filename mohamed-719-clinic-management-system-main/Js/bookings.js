
let email = localStorage.getItem("email");
let username = localStorage.getItem("username");
let doctorData;
let resloaded = []
let userData;
fetch("http://localhost:3000/users")
    .then(res => res.json())
    .then(users => {
        userData = users.find(u => u.email === email);
        return userData.bookings
    }).then(value => {
        var container = document.getElementById("bookings-container");
        console.log(value)
        if (!value || value.length === 0) {
            let bookNow =document.createElement("input")
            bookNow.type="button"
            bookNow.value= "Make an Appointment Now!";
            bookNow.style.cssText=`
            margin-top:30px;
            background: #007bff;
            color: white;
            font-weight:bold;
            border:white;
            border-radius:  10px;
            cursor: pointer;
            transition: 0.3s;
            width : 75%;
            height : 75px;
            `
            bookNow.addEventListener("mouseout",()=>{
                bookNow.style.cssText=`
                    margin-top:30px;
                    background: #007bff;
                    color: white;
                    font-weight:bold;
                    border:white;
                    border-radius:  10px;
                    cursor: pointer;
                    transition: 0.3s;
                    width : 75%;
                    height : 75px;
            `
            })
            bookNow.addEventListener("mouseover",() =>
                {
                    bookNow.style.cssText=`
                        margin-top:30px;    
                        background: white;
                        color:#007bff;
                        font-weight:bold;
                        border:white;
                        border-radius:  10px;
                        cursor: pointer;
                        transition: 0.3s;
                        width : 75%;
                        height : 75px;
                    `
                } )
            bookNow.addEventListener("click",() =>
                {
                    window.location.href="index.html";
                } )
            
            container.appendChild(bookNow)
        }
        for (let book of value) {
            let doctorId = book.doctorID;
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    var str = xmlHttp.responseText;
                    implementData(str);
                }
            };
            xmlHttp.open("GET", "./Js/doctorexamplejason.json", false);
            xmlHttp.send();

            function implementData(d) {
                var jsonData = JSON.parse(d);
                var doctors = jsonData.doctors;
                doctors.forEach(doctor => {
                    if (doctor.ID == Number(doctorId)) {
                        doctorData = doctor;
                        console.log(doctorData)
                    }
                });


            }

            var card = document.createElement("div");
            card.className = "booking-card";

            var statusClass = String(book.status).toLowerCase().replace(" ", "");
            let rating = Number(doctorData.rating.overallRate)
            var stars = "★".repeat(rating) + "☆".repeat(5 - rating);
            var actionButtons = "";
            if (book.status !== "Canceled") {
                actionButtons = `<button class="cancel-btn" '>Cancel</button>`;
            }
            const clinicLocation = doctorData.clinic.location
            card.innerHTML = `
            <img class="booking-img" src="${doctorData.imageURL}" alt="Booking Image">
            <div class="booking-info">
                <h3>${doctorData.name}</h3>
                <div class="rating">${stars}</div>
                <p class="price">${doctorData.Fees}</p>
                <p class="phone">📞 ${doctorData.clinic.phone}</p>
                <p><strong>Date:</strong> ${book.bookingDate}</p>
                <p><strong>Time:</strong> ${book.bookingTime}</p>
                <p><strong>Branch:</strong> ${clinicLocation.govern} ${clinicLocation.city} ${clinicLocation.street} ${clinicLocation.block}</p>
                <span class="status ${statusClass}">${book.status}</span>
                <div class="actions" data-doctor-id = "${doctorId}" data-date="${book.bookingDate}" data-time="${book.bookingTime}" onclick="cancelBooking(event)" >
                    ${actionButtons}
                </div>
            </div>
        `;

            container.appendChild(card)
        }


    })
function cancelBooking(event) {
    const doctorID = event.currentTarget.getAttribute("data-doctor-id");
    const bookingDate = event.currentTarget.getAttribute("data-date");
    const bookingTime = event.currentTarget.getAttribute("data-time");

    console.log("Canceling:", doctorID, bookingDate, bookingTime);

    fetch("http://localhost:3000/users")
        .then(res => res.json())
        .then(users => {
            let userData = users.find(u => u.email === email);

            if (!userData) {
                alert("User not found!");
                return;
            }

            // ابحث عن الحجز اللي عايز تلغيه
            let bookingIndex = userData.bookings.findIndex(
                b => b.doctorID == doctorID &&
                    b.bookingDate == bookingDate &&
                    b.bookingTime == bookingTime
            );

            if (bookingIndex === -1) {
                throw new Error("Booking not found!");
            }

            // شيل الحجز من الـ Array
            userData.bookings.splice(bookingIndex, 1);

            // حفظ التحديثات في الـ db.json
            return fetch(`http://localhost:3000/users/${userData.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookings: userData.bookings })
            });
        })
        .then(res => {
            if (!res || !res.ok) throw new Error("Failed to cancel booking");
            return res.json();
        })
        .then(() => {
            alert("Booking canceled!");
            window.location.href="index.html";
        })
        .catch(err => {
            console.error("Error canceling booking:", err);
            alert("Something went wrong.");
        });
}




