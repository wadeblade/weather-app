"use strict"

/* API */

const link = "http://api.weatherstack.com/current?access_key=e1fa979715d7044a9b91dccea6b20e82";

/* DOM */

const root = document.getElementById("root");
const popup = document.getElementById("popup");
const textInput = document.getElementById("text-input");
const form = document.getElementById("form");
const popupClose = document.getElementById("close");

/* Store */

let store = {
    city: "Drogobych",
    feelslike: 0,
    temperature: 0,
    observationTime: "00:00 AM",
    isDay: "yes",
    weatherDescriptions: "",
    properties: {
        cloudcover: {},
        humidity: {},
        windSpeed: {},
        pressure: {},
        uvIndex: {},
        visibility: {},
    },
};

/* fetchData Function */

async function fetchData() {

    /* Getting data from the API */

    const result = await fetch(`${link}&query=${store.city}`);
    const data = await result.json();

    // Destructuring

    const {
        current: {
            feelslike,
            cloudcover,
            temperature,
            humidity,
            observation_time: time,
            pressure,
            uv_index: index,
            visibility,
            is_day: isDay,
            weather_descriptions: description,
            wind_speed: windSpeed
        },
        location: {
            name,
        }
    } = data;

    /* Entering data from the API into the store */

    store = {
        feelslike,
        temperature,
        observationTime: time,
        isDay: isDay,
        weatherDescriptions: description[0],
        city: name,

        /* Creating an internal object for ease of use */

        properties: {
            cloudcover: {
                title: "cloudcover",
                value: `${cloudcover} %`,
                icon: "cloud.png"
            },
            humidity: {
                title: "humidity",
                value: `${humidity} %`,
                icon: "humidity.png"
            },
            windSpeed: {
                title: "wind speed",
                value: `${windSpeed} km/h`,
                icon: "wind.png"
            },
            pressure: {
                title: "pressure",
                value: `${pressure} kPa`,
                icon: "gauge.png"
            },
            uvIndex: {
                title: "uv index",
                value: `${index}/12`,
                icon: "uv-index.png"
            },
            visibility: {
                title: "visibility",
                value: `${visibility} %`,
                icon: "visibility.png"
            },
        },
    }

    /* Rendering the component */

    renderComponent();
}

/* Output of pictures depending on the received description from the API */

function getImage(description) {
    let value = description.toLowerCase()

    switch (value) {
        case "overcast":
            return "partly.png";
        case "partly cloudy":
            return "partly.png";
        case "fog":
            return "fog.png";
        case "rain":
            return "rain.png";
        case "cloudy":
            return "cloud.png";
        case "sunny":
            return "sunny.png";
        case "clear":
            return "clear.png";
        case "patchy rain possible":
            return "patchy-rain.png";
        case "light rain":
            return "light-rain.png";
        case "light rain shower":
            return "light-rain.png";
        case "mist":
            return "mist.png"
        default:
            return "sunny.png"
    }
}

/*
We have a "properties" object that we created in the fetchData function.
By destructuring, we get data and output it
*/

function renderProperty(properties) {

    return Object.values(properties).map(({title, value, icon}) => {

        return `<div class="property">
            <div class="property-icon">
              <img src="./img/icons/${icon}" alt="">
            </div>
            <div class="property-info">
              <div class="property-info__value">${value}</div>
              <div class="property-info__description">${title}</div>
            </div>
          </div>`;

    }).join("");
// We get an array back, so we convert it to strings.
}

/* Function that returns a container */

const markup = () => {

    // Destructuring

    const {
        city,
        weatherDescriptions,
        observationTime,
        temperature,
        isDay,
        properties
    } = store;

    /* Check if the background changes depending on day or night */

    const containerClass = isDay === "yes" ? "is-day" : "";

    /* By destructuring, we output values into fields */

    return `<div class="container ${containerClass}">
            <div class="top">
              <div class="city">
                <div class="city-subtitle">Weather Today in</div>
                  <div class="city-title" id="city">
                  <span>${city}</span>
                </div>
              </div>
              <div class="city-info">
                <div class="top-left">
                
                <! Adding a description to image function -->
                
                <img class="icon" src="./img/${getImage(weatherDescriptions)}" alt="" />
                <div class="description">${weatherDescriptions}</div>
              </div>
            
              <div class="top-right">
                <div class="city-info__subtitle">as of ${observationTime}</div>
                <div class="city-info__title">${temperature}°</div>
              </div>
            </div>
          </div>
          
          <! Adding a properties to our renderPropery function -->
          
        <div id="properties">${renderProperty(properties)}</div>
      </div>`
}

/* Handles */

const togglePopupClass = () => {
    popup.classList.toggle("active");
}

const handleInput = (event) => {
    store = {
        ...store,
        city: event.target.value
    };
};

const handleSubmit = (event) => {
    event.preventDefault();

    if (!store.city) return null

    fetchData();
    togglePopupClass();
}

const handlePopupClose = () => {
    togglePopupClass();
}

/* renderComponent */

const renderComponent = () => {

    /* Adding markup function to root */

    root.innerHTML = markup();

    /* Access to the popup */

    const city = document.getElementById("city");
    city.addEventListener("click" , togglePopupClass)
};

/* Resetting submit and set fetchData function*/

form.addEventListener("submit", handleSubmit );

/* Entering data from input to store */

textInput.addEventListener("input" , handleInput);

/* Closing the popup */

popupClose.addEventListener("click" , handlePopupClose);

/* Calling fetchData function */

fetchData();
