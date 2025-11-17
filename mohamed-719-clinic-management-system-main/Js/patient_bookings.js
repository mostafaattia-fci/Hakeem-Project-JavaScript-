// Seed Data - بيضيف بيانات تجريبية أول مرة
/*
function seedData() {
    var bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    if (bookings.length === 0) {
        bookings = [
            {
                bookingId: "B001",
                name: "Dr. Ahmed Ali",
                rating: 4,
                img: "./images/woman.jpg",
                price: "250 EGP",
                phone: "01012345678",
                datetime: "2025-08-20 10:00 AM",
                branch: "Cairo - Nasr City",
                status: "Confirmed"
            },
            {
                bookingId: "B002",
                name: "Dr. Sara Mohamed",
                rating: 5,
                img: "./images/man2.jpg",
                price: "300 EGP",
                phone: "01098765432",
                datetime: "2025-08-22 2:00 PM",
                branch: "Giza - Dokki",
                status: "Reserved"
            },
            {
                bookingId: "B003",
                name: "Dr. Hossam Youssef",
                rating: 3,
                img: "./images/man.jpg",
                price: "200 EGP",
                phone: "01123456789",
                datetime: "2025-08-25 6:00 PM",
                branch: "Alexandria - Smouha",
                status: "Confirmed"
            }
        ];

        localStorage.setItem("bookings", JSON.stringify(bookings));
    }
}

*/
let patientId = 1; // معرف المريض
var pBookingData;
var canceledBookingID=0;

var xmlHttp = new XMLHttpRequest();
xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var str = xmlHttp.responseText;
        handleBooking(str);
         
    }
}
xmlHttp.open("GET", "Js/patientAccJason.txt", true);
xmlHttp.send();

function handleBooking(data) {
  
   var jsonData = JSON.parse(data);

    var patients = jsonData.account.patient;

    patients.forEach(patient => {
        // البحث عن بيانات الحجز للمريض المحدد

        if (patient.ID == patientId) {    
            pBookingData = patient.bookings;
        }
    });

    if (!pBookingData || pBookingData.length === 0) {
        document.getElementById("bookings-container").innerHTML = 
            '<div class="no-bookings" style="text-align:center; padding:20px;">' +
            '<img src="" style="width:80px;"><p>You have no bookings yet</p></div>';
    }
    alert("Data loaded successfully");
    if(canceledBookingID != 0) {
        // إلغاء الحجز
        pBookingData.forEach(b => {
            if (b.bookID == canceledBookingID) {
                b.status = "Canceled";
            }
        });
        canceledBookingID = 0; // Reset after cancellation
    }
    // Call the function to load bookings
    loadBookings(pBookingData);
}



// إلغاء الحجز
function cancelBooking(bookingId) {
    
    if (!confirm("Are you sure you want to cancel this booking?")) {
        cancelBookingID = bookingId;
    }
    // change status of booking to "Canceled" with bookingId in jason file
    
    
}

// عرض الحجوزات
function loadBookings(bookData) {
     
    var container = document.getElementById("bookings-container");
    container.innerHTML = "";

    bookData.forEach (b => {
        var card = document.createElement("div");
        card.className = "booking-card";

        var statusClass = b.status.toLowerCase().replace(" ", "");
        var stars = "★".repeat(b.doctorRating) + "☆".repeat(5 - b.doctorRating);

        var actionButtons = "";
        if (b.status !== "Canceled") {
            actionButtons = `<button class="cancel-btn" onclick='cancelBooking("${b.bookingId}")'>Cancel</button>`;
        }

        card.innerHTML = `
            <img class="booking-img" src="${b.doctorImgURL}" alt="Booking Image">
            <div class="booking-info">
                <h3>${b.doctorName}</h3>
                <div class="rating">${stars}</div>
                <p class="price">${b.sessionPrice}</p>
                <p class="phone">📞${b.clinicPhone}</p>
                <p><strong>Date:</strong> ${b.bookingDate}</p>
                <p><strong>Time:</strong> ${b.bookingTime}</p>
                <p><strong>Branch:</strong> ${b.clinicLocation.govern} ${b.clinicLocation.city} ${b.clinicLocation.street} ${b.clinicLocation.block}</p>
                <span class="status ${statusClass}">${b.status}</span>
                <div class="actions">
                    ${actionButtons}
                </div>
            </div>
        `;
        var statusSpan = document.querySelector(".status");
        if(b.status === "canceled") {
            statusSpan.style.cssText = `
                background-color: red; /* Green */
                color: white;
            `;
        }
        container.appendChild(card);
    });
}

// تشغيل
//seedData();

