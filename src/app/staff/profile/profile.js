const user = {
    fullName: "Rahul Sharma",
    initial: "R",
    employeeId: "EMP-0072",
    contactNumber: "+91 98765 43210",
    email: "rahul.sharma@dsrweb.com",
    department: "Billing Support",
    designation: "Support Executive",
    joiningDate: "15 March 2022",
    status: "Active"
};


// Edit Profile
function editProfile() {
    alert("Edit Profile clicked");
}


// Change Password
function changePassword() {
    alert("Change Password clicked");
}


// Logout
function logout() {

    const confirmLogout = confirm(
        "Are you sure you want to logout?"
    );

    if (confirmLogout) {

        localStorage.removeItem("isLoggedIn");

        window.location.href = "/login";
    }
}


// Toggle Sidebar
function toggleSidebar() {

    const sidebar = document.querySelector(".sidebar");

    if (sidebar) {
        sidebar.classList.toggle("mobile-sidebar");
    }
}