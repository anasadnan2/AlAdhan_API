axios
  .get("https://countriesnow.space/api/v0.1/countries")
  .then((response) => {
    const countries = response.data.data;
    const countrySelect = document.getElementById("country-select");

    countries.forEach((country) => {
      const option = document.createElement("option");
      option.value = country.country;
      option.textContent = country.country;
      countrySelect.appendChild(option);
    });

    countrySelect.addEventListener("change", () => {
      const selectedCountry = countrySelect.value;
      chooescity(selectedCountry, countries);
    });
  })
  .catch((error) => {
    console.error("Error fetching countries:", error);
  });

function chooescity(selectedCountry, countries) {
  const citySelect = document.getElementById("city-select");
  citySelect.innerHTML = "<option value=''>City</option>";

  const countryData = countries.find((c) => c.country === selectedCountry);

  if (countryData && countryData.cities) {
    countryData.cities.forEach((city) => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });
  }

  citySelect.addEventListener("change", () => {
    const selectedCity = citySelect.value;
    if (selectedCity) {
      getPrayerTimes(selectedCity, selectedCountry);
    }
  });
}

function getPrayerTimes(selectedCity, selectedCountry) {
  axios
    .get("https://api.aladhan.com/v1/timingsByCity", {
      params: {
        city: selectedCity,
        country: selectedCountry,
        method: 2,
      },
    })
    .then((response) => {
      const timings = response.data.data.timings;
      const date = response.data.data.date.readable;

      const prayers = {
        "time-fajr": timings.Fajr,
        "time-sunrise": timings.Sunrise,
        "time-dhuhr": timings.Dhuhr,
        "time-asr": timings.Asr,
        "time-maghrib": timings.Maghrib,
        "time-isha": timings.Isha,
      };

      for (const [id, time] of Object.entries(prayers)) {
        const el = document.getElementById(id);
        if (el) el.textContent = time;
      }

      const dateEl = document.querySelector("#date div:nth-child(2)");
      if (dateEl) dateEl.textContent = date;
    })
    .catch((error) => {
      console.error("Error fetching prayer times:", error);
    });
}
