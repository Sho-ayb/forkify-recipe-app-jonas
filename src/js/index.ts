'use-strict';

// importing the style file
import '../scss/style.scss';

// importing the logo image
// Nb. on getting the following ts error: cannot find module or its corresponding type declarations, the solution is to create a custom.d.ts file, which tells typescript to treat these image files with specific extensions with a type declaration of "string".
import logoImg from '../assets/img/logo.png';
import icons from '../assets/img/icons.svg';

// query selection of DOM elements

const headerEl = document.querySelector('.header')! as HTMLElement;

// creating a img element

const logo = document.createElement('img') as HTMLImageElement;
logo.src = logoImg;
logo.alt = 'Logo';
logo.className = 'header__logo';

// insert the logo
headerEl.insertAdjacentElement('afterbegin', logo);
