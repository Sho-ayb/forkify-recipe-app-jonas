'use-strict';

// importing the style file
import '../scss/style.scss';

// importing the logo image
// Nb. on getting the following ts error: cannot find module or its corresponding type declarations, the solution is to create a custom.d.ts file, which tells typescript to treat these image files with specific extensions with a type declaration of "string".
import logoImg from '../assets/img/logo.png';

// query selection of DOM elements

const headerEl = document.querySelector('.header')! as HTMLElement;

// creating a img element

const logo = document.createElement('img') as HTMLImageElement;
logo.src = logoImg;
logo.alt = 'Logo';
logo.className = 'header__logo';

// insert the logo
headerEl.insertAdjacentElement('afterbegin', logo);

const init = () => {
  function toggleSearchList() {
    const aside = document.querySelector('.recipe__search-list-container');
    aside?.classList.toggle('active');
    aside?.classList.remove('hidden');
  }

  // Call this on page load and window resize

  function handleResponsiveLayout() {
    const aside = document.querySelector('.recipe__search-list-container');
    if (window.innerWidth >= 768) {
      aside?.classList.remove('hidden');
      aside?.classList.remove('active');
    } else {
      aside?.classList.add('hidden');
    }
  }

  function handleSearch(event: Event) {
    event.preventDefault();
  }

  window.addEventListener('resize', handleResponsiveLayout);

  document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('.header__search-form');
    if (searchForm) {
      searchForm.addEventListener('submit', handleSearch);
    }

    const searchBtn = document.querySelector('.header__search-form-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', toggleSearchList);
    }

    handleResponsiveLayout(); // call on page load
  });
};

init();
