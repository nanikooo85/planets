document.addEventListener("DOMContentLoaded", () => {
    const planetText = document.querySelector('.planet-text');
    const planetImage = document.querySelector('.planet-image img');
    const sourceLink = document.getElementById("source-link");
    const dataElements = {
        rotation: document.getElementById("rotation-time-value"),
        revolution: document.getElementById("revolution-time-value"),
        radius: document.getElementById("radius-value"),
        averageTempElement: document.getElementById("average-temp-value"), // Updated to include the average temperature element
    };

    function updatePlanetInfo(planet, section) {
        planetText.querySelector('h1').textContent = planet.name;
        planetText.querySelector('p').textContent = planet[section].content;
        sourceLink.href = planet[section].source;

        for (const key in dataElements) {
            if (key === "averageTempElement") {
                dataElements[key].textContent = planet.temperature; // Update the "Average Temp" value
            } else {
                dataElements[key].textContent = planet[key.toLowerCase()];
            }
        }

        // Update the planet image based on the section
        const imageSection = section.toLowerCase();
        planetImage.src = planet.images[imageSection] || planet.images.planet;
    }

    function handlePlanetClick(event) {
        event.preventDefault();
        const planetName = event.target.getAttribute("data-planet");
        const section = "overview"; // Default to "Overview"
        const planet = data.find(p => p.name.toLowerCase() === planetName.toLowerCase());
        updatePlanetInfo(planet, section);
    }

    // Fetch planet data from the API
    let data; // Store the fetched data globally

    fetch("https://planets-api.vercel.app/api/v1/planets")
        .then(response => response.json())
        .then(apiData => {
            data = apiData; // Store the data globally

            // Initial load for Mercury
            updatePlanetInfo(data[0], "overview");

            // Handle clicks on planet links
            const planetLinks = document.querySelectorAll("nav ul li a");
            planetLinks.forEach(link => {
                link.addEventListener("click", handlePlanetClick);
            });

            // Handle clicks on buttons for "Overview," "Internal Structure," and "Surface Geology"
            const buttons = document.querySelectorAll(".planet-text ul li button");
            buttons.forEach(button => {
                button.addEventListener("click", (event) => {
                    const section = event.target.id.replace("-button", "");
                    const planetName = planetText.querySelector('h1').textContent;
                    const planet = data.find(p => p.name.toLowerCase() === planetName.toLowerCase());
                    updatePlanetInfo(planet, section);
                });
            });
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
});
