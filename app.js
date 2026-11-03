const apiBase = "https://dog.ceo/api";
const fetchButton = document.querySelector("#fetch-dog");
const statusMessage = document.querySelector("#status");
const resultCard = document.querySelector("#result");
const dogImage = document.querySelector("#dog-image");
const imagePlaceholder = document.querySelector("#image-placeholder");
const breedName = document.querySelector("#breed-name");

let breedOptions;

function toTitleCase(value) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function getBreedOptions() {
  if (breedOptions) {
    return breedOptions;
  }

  const response = await fetch(`${apiBase}/breeds/list/all`);
  if (!response.ok) {
    throw new Error("Could not load the breed list.");
  }

  const result = await response.json();
  if (result.status !== "success" || !result.message) {
    throw new Error("The breed service returned an invalid breed list.");
  }

  breedOptions = Object.entries(result.message).flatMap(([breed, subBreeds]) => {
    if (subBreeds.length === 0) {
      return [{ breed, subBreed: "", label: toTitleCase(breed) }];
    }

    return subBreeds.map((subBreed) => ({
      breed,
      subBreed,
      label: `${toTitleCase(subBreed)} ${toTitleCase(breed)}`,
    }));
  });

  return breedOptions;
}

async function fetchDog() {
  const options = await getBreedOptions();
  const selection = options[Math.floor(Math.random() * options.length)];
  const imagePath = selection.subBreed
    ? `breed/${encodeURIComponent(selection.breed)}/${encodeURIComponent(selection.subBreed)}/images/random`
    : `breed/${encodeURIComponent(selection.breed)}/images/random`;
  const response = await fetch(`${apiBase}/${imagePath}`);

  if (!response.ok) {
    throw new Error("Could not fetch a dog image.");
  }

  const result = await response.json();
  if (result.status !== "success" || typeof result.message !== "string") {
    throw new Error("The dog service returned an invalid image.");
  }

  return { imageUrl: result.message, label: selection.label };
}

fetchButton.addEventListener("click", async () => {
  fetchButton.disabled = true;
  statusMessage.classList.remove("error");
  statusMessage.textContent = "Finding your new friend...";

  try {
    const dog = await fetchDog();
    dogImage.hidden = true;
    imagePlaceholder.hidden = false;
    dogImage.alt = `${dog.label} dog`;
    dogImage.onload = () => {
      imagePlaceholder.hidden = true;
      dogImage.hidden = false;
    };
    dogImage.onerror = () => {
      dogImage.hidden = true;
      imagePlaceholder.hidden = false;
      statusMessage.classList.add("error");
      statusMessage.textContent = "The breed was found, but its photo could not be loaded. Try again.";
    };
    dogImage.src = dog.imageUrl;
    breedName.textContent = dog.label;
    resultCard.hidden = false;
    statusMessage.textContent = "A new friend is here!";
  } catch (error) {
    statusMessage.classList.add("error");
    statusMessage.textContent = error instanceof Error
      ? `${error.message} Check your connection and try again.`
      : "Something went wrong while fetching a dog. Try again.";
  } finally {
    fetchButton.disabled = false;
  }
});
