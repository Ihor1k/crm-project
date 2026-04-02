import { InputField } from "../components/InputField.js";
import { brandAssets } from "../assets/brand.js";

export function LoginPage({ onEnterDemo } = {}) {
  const state = {
    email: "",
    password: "",
  };

  const markup = `
    <main class="login-page">
      <section class="login-page__left" aria-hidden="true"></section>

      <section class="login-page__right">
        <div class="login-page__content">
          <img class="login-page__logo" src="${brandAssets.loginLogo}" alt="Illus logo" width="88" height="48" />

          <header class="login-page__header">
            <h1>WELCOME TO<br />MODULOR RADAR</h1>
            <p>Access the Demo Workspace</p>
          </header>

          <form class="login-form" id="login-form" novalidate>
            ${InputField({
              id: "email",
              name: "email",
              type: "email",
              label: "Email",
              showRequired: true,
              placeholder: "Enter Email",
              value: state.email,
              icon: "email",
            })}
            ${InputField({
              id: "password",
              name: "password",
              type: "password",
              label: "Password",
              showRequired: true,
              placeholder: "Enter Password",
              value: state.password,
              icon: "password",
            })}
            <button class="login-form__submit" type="submit">Enter Demo</button>
          </form>

          <p class="login-page__note">Demo environment. Authentication is simulated.</p>
        </div>

        <img
          class="login-page__shape"
          src="${brandAssets.loginOrb}"
          alt=""
          width="180"
          height="180"
          aria-hidden="true"
        />
      </section>
    </main>
  `;

  function mount(target) {
    target.innerHTML = markup;

    const form = target.querySelector("#login-form");
    const emailInput = target.querySelector("#email");
    const passwordInput = target.querySelector("#password");

    if (!form || !emailInput || !passwordInput) {
      return;
    }

    emailInput.addEventListener("input", (event) => {
      state.email = event.target.value;
    });

    passwordInput.addEventListener("input", (event) => {
      state.password = event.target.value;
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (typeof onEnterDemo === "function") {
        onEnterDemo();
      }
    });
  }

  return {
    mount,
  };
}
