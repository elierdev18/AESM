const container = document.querySelector(".container")
const btnSignIn = document.getElementById("btn-sign-in");
const btnSignUp = document.getElementById("btn-sign-up");
console.log("login.js cargado");


btnSignIn.addEventListener("click",()=>{
    container.classList.remove("toggle");
     
});

btnSignUp.addEventListener("click",()=>{
    container.classList.add("toggle");
     
});
// Obtener formularios de inicio de sesión y registro
const formSignIn = document.querySelector("form.sing-in");
const formSignUp = document.querySelector("form.sing-up");

// --- Manejar inicio de sesión ---
if (formSignIn) {
    formSignIn.addEventListener("submit", async (e) => {
        e.preventDefault();
        // En el formulario de inicio de sesión se buscan los inputs con placeholder "Email" y "password"
        const emailInput = formSignIn.querySelector("input[placeholder='Email']");
        const passwordInput = formSignIn.querySelector("input[placeholder='password']");
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (email === "" || password === "") {
            alert("Por favor, ingrese email y contraseña.");
            return;
        }

        try {
            const response = await fetch("../php/iniciar_sesion.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const result = await response.json();
            console.log("Resultado de inicio de sesión:", result);
            if (!response.ok) {
                throw new Error(result.error || "Error en inicio de sesión.");
            }
            if (result.success) {
                // Redirige a admin.html si las credenciales son válidas
                window.location.href = "admin.html";
            } else {
                throw new Error(result.error || "Credenciales inválidas.");
            }
        } catch (error) {
            alert("Error: " + error.message);
        }
    });
}

// --- Manejar registro de usuario ---
if (formSignUp) {
    formSignUp.addEventListener("submit", async (e) => {
        e.preventDefault();
        // En el formulario de registro se buscan los inputs con placeholder "Nombre", "Email" y "password"
        const nameInput = formSignUp.querySelector("input[placeholder='Nombre']");
        const emailInput = formSignUp.querySelector("input[placeholder='Email']");
        const passwordInput = formSignUp.querySelector("input[placeholder='password']");
        const nombre = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (nombre === "" || email === "" || password === "") {
            alert("Complete todos los campos para registrarse.");
            return;
        }

        try {
            const response = await fetch("../php/registro.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, email, password })
            });
            const result = await response.json();
            console.log("Resultado de registro:", result);
            if (!response.ok) {
                throw new Error(result.error || "Error en el registro.");
            }
            if (result.success) {
                alert(result.message || "¡Registrado con éxito!");
                // Opcional: Alternar automáticamente al formulario de inicio de sesión
                container.classList.remove("toggle");
                formSignUp.reset();
            } else {
                throw new Error(result.error || "Error desconocido en el registro.");
            }
        } catch (error) {
            alert("Error: " + error.message);
        }
    });
}