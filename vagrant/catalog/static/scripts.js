(function() {
  /**
   * Sets up an item form. Add and Edit are essentially
   * the same form with a few differences in verbiage.
   *
   * @param {number} id
   * @param {Function} method
   * @param {string} verb
   */
  function setupItemForm(id, method, verb) {
    var form = document.getElementById(id);
    var errorMessage = [
      "There was an error ",
      method === "POST" ? "creating" : "updating",
      " your item"
    ].join("");
    var successMessage = [
      "Item successfully ",
      method === "POST" ? "created" : "updated"
    ].join("");

    form.addEventListener("submit", function(e) {
      var formData = new FormData(e.target);
      var formAction = form.getAttribute("action");

      fetch(formAction, {
        method: method,
        body: formData,
        credentials: "same-origin"
      })
        .then(function(response) {
          if (response.ok && response.redirected) {
            alert(successMessage);
            window.location.href = response.url;
          } else {
            // just makes sure to cascade to catch
            throw new Error("general error");
          }
        })
        .catch(function() {
          alert(errorMessage);
        });
      e.preventDefault();
    });
  }

  /**
   * Add functionality to delete button so that when clicked a
   * DELETE request is sent to the server
   *
   * @param {number} id
   * @param {string} name
   */
  function setupDeleteButton(id, name) {
    document
      .getElementById("delete-button")
      .addEventListener("click", function() {
        if (confirm('Are you sure you want to delete "' + name + '"?')) {
          fetch("/item/delete/" + id, {
            method: "DELETE",
            credentials: "same-origin"
          })
            .then(function(response) {
              if (response.ok && response.redirected) {
                alert('"' + name + '" successfully deleted');
                // redirect to the url specified in the server redirect
                window.location.href = response.url;
              } else {
                // just makes sure to cascade to catch
                throw new Error("general error");
              }
            })
            .catch(function(e) {
              alert('There was an error deleting "' + name + '"');
            });
        }
      });
  }
  /**
   * Connect the google auth front-end to the backend oauth
   * @param {string} state
   */
  function getSignInCallback(state) {
    console.log("getting signInCallback", state);
    return function signInCallback(authResult) {
      if (authResult["code"]) {
        // Hide the sign-in button now that the user is authorized
        document
          .getElementById("signInButton")
          .setAttribute("style", "display: none");
        // Send the one-time-use code to the server, if the server responds, write a 'login successful' message to the web page and then redirect back to the main restaurants page
        fetch("/gconnect?state=" + state, {
          method: "POST",
          body: authResult["code"],
          credentials: "same-origin",
          headers: new Headers({
            "Content-Type": "application/octet-stream; charset=utf-8"
          })
        })
          .then(function(result) {
            return result.text();
          })
          .then(function(result) {
            // Handle or verify the server response if necessary.
            if (result) {
              document.getElementById("result").innerHTML =
                "Login Successful!</br>" + result + "</br>Redirecting...";
              setTimeout(function() {
                window.location.href = "/";
              }, 4000);
            } else if (authResult["error"]) {
              console.log("There was an error: " + authResult["error"]);
            } else {
              $("#result").html(
                "Failed to make a server-side call. Check your configuration and console."
              );
            }
          });
      }
    };
  }

  window.itemCatalog = {
    setupItemForm: setupItemForm,
    setupDeleteButton: setupDeleteButton,
    getSignInCallback: getSignInCallback
  };
})();
