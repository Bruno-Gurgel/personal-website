/* ENTRY CODE */

// Importing styles
import './style/landing_page/style.css';

// Importing image
import productImage from './img/landing_page/product.jpg';

const product = document.querySelector('.product__image');
product.src = productImage;

/* MAIN CODE */

// Global variables
const sections = document.getElementsByTagName('section');

// Function that creates dynamically the NavBar
const createNavBar = () => {
  const navBar = document.querySelector('#navbar__list');
  const fragment = document.createDocumentFragment();

  for (const section of sections) {
    const newElement = document.createElement('li');
    newElement.innerHTML = `<a class="menu__link" id="menu__${section.id}" href="#${section.id}"> ${section.dataset.nav}</a>`;
    fragment.appendChild(newElement);
  }
  navBar.appendChild(fragment);
};
createNavBar();

// Variables made with the navbar

// Showing the sections content only when the linked Nav button is clicked
const showSection = () => {
  const navBar = document.querySelector('#navbar__list');
  const footer = document.querySelector('.page__footer');

  navBar.addEventListener('click', (event) => {
    event.preventDefault();
    for (const section of sections) {
      section.style.display = 'none';
      const currentSelection = event.target.id;
      const sectionNumber = currentSelection.slice(-1);
      const element = document.querySelector(`#section${sectionNumber}`);
      // const element = document.querySelector('#section' + sectionNumber);
      element.style.display = 'block';
      // Add border only when a section is shown
      footer.setAttribute('style', 'border-top: 2px inset #ccc;');
      element.scrollIntoView({ behavior: 'smooth' });
    }
  });
};
showSection();

// Highlights the clicked menu item. Initially no item is highlighted
const activeItem = () => {
  const menuLink = document.querySelectorAll('.menu__link');

  for (const item of menuLink) {
    item.addEventListener('click', function (event) {
      const current = event.target.id;
      // current.className += ' active';
      const oldItem = document.querySelectorAll('.active');
      for (const element of oldItem) {
        element.classList.remove('active');
      }
      const newActive = document.getElementById(current);
      newActive.className += ' active';
      observingEvent();
    });
  }
};
activeItem();

/*
If the banner's motives list is on the viewport, no menu item is highlighted
But if the user scrolls back to the section it gets highlighted again 
*/
const observingEvent = () => {
  const bannerMotives = document.querySelector('.motives__list__banner');

  const options = {
    root: document.querySelector('#viewport'), // default
    rootMargin: '0px', // default
    threshold: 1.0,
  };

  const callback = (entries) => {
    const itemActive = document.querySelector('.active');
    entries.forEach((entry) => {
      itemActive.style.backgroundColor = entry.isIntersecting ? '#ffc85a' : '';
    });
  };

  const observer = new IntersectionObserver(callback, options);
  observer.observe(bannerMotives);
};

// Function to display the menu list on Mobile & Tabconst layouts
// Toggle between showing and hiding the navigation menu links when the user clicks on the hamburger menu / bar icon
/* eslint-disable */
const toggleMenu = (() => {
  /* eslint-enable */
  // Menu animation

  const mobileMenu = document.querySelector('.mobile__menu');
  const navBar = document.querySelector('#navbar__list');

  mobileMenu.addEventListener('click', function () {
    this.classList.toggle('change');

    if (navBar.style.display === 'block') {
      navBar.style.display = 'none';
    } else {
      navBar.style.display = 'block';
    }
  });
})();
