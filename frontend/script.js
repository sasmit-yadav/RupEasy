
document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const signinForm = document.getElementById('signinForm');

  if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = this.fullname.value.trim();
      const email = this.email.value.trim();
      const password = this.password.value;
      const confirm = this.confirm.value;

      if (!name || !email || !password || !confirm) {
        alert('Please fill all the fields!');
        return;
      }

      if (password.length < 6) {
        alert('Password must be at least 6 characters!');
        return;
      }

      if (password !== confirm) {
        alert('Passwords do not match!');
        return;
      }

      // Simulate account creation
      alert(`Welcome to Rupeezy, ${name}! Redirecting to Sign In...`);
      window.location.href = 'signin.html';
    });
  }
});

function handleApplyClick() {
  const name = sessionStorage.getItem("userName");
  const email = sessionStorage.getItem("userEmail");

  if (name && email) {
    // Redirect directly — no need to pass name/email in URL
    window.location.href = "apply.html";
  } else {
    alert("You must sign in to apply for a loan.");
    window.location.href = "signin.html";
  }
}


function logout() {
  alert('You have been logged out.');
  window.location.href = 'signin.html';
}


const profileBtn = document.getElementById("profileBtn");
const dropdownMenu = document.getElementById("dropdownMenu");

profileBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent closing on the same click
  dropdownMenu.style.display =
    dropdownMenu.style.display === "block" ? "none" : "block";
});

// Close dropdown when clicking outside
window.addEventListener("click", function () {
  dropdownMenu.style.display = "none";
});
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("profileForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Profile updated successfully!");
    });
  }
});


  document.addEventListener("DOMContentLoaded", async () => {
    const email = sessionStorage.getItem("userEmail");

    if (!email) {
      alert("Please sign in first.");
      window.location.href = "signin.html";
      return;
    }

    const form = document.getElementById("profileForm");

    // Fetch profile data
    try {
      const res = await fetch(`http://localhost:5000/api/profile?email=${encodeURIComponent(email)}`);
      const user = await res.json();

      if (user) {
        document.getElementById("name").value = user.name || "";
        document.getElementById("email").value = user.email || "";
        document.getElementById("phone").value = user.phone || "";
        document.getElementById("aadhar").value = user.aadhar || "";
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      alert("Could not load your profile.");
    }

    // Handle form submission 
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const updatedProfile = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value, // won't change email in DB ideally
        phone: document.getElementById("phone").value,
        aadhar: document.getElementById("aadhar").value
      };

      try {
        const res = await fetch("http://localhost:5000/api/profile/update", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProfile)
        });

        const data = await res.json();

        if (res.ok) {
          alert("Profile updated successfully!");
        } else {
          alert("Update failed: " + (data.error || "Unknown error"));
        }
      } catch (err) {
        console.error("Update error:", err);
        alert("Something went wrong while updating.");
      }
    });
  });

  function logout() {
    sessionStorage.clear();
    window.location.href = "signin.html";
  }

