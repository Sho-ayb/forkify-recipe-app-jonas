'use-strict';

// importing the style file
import '../scss/style.scss';

// importing the logo image
// Nb. on getting the following ts error: cannot find module or its corresponding type declarations, the solution is to create a custom.d.ts file, which tells typescript to treat these image files with specific extensions with a type declaration of "any".
import logoImg from '../assets/img/logo.png';

// query selection of DOM elements

const headerEl = document.querySelector('.header')! as HTMLElement;

// creating a img element

const logo = document.createElement('img') as HTMLImageElement;
logo.src = logoImg;
logo.alt = 'Logo';

// insert the logo
headerEl.insertAdjacentElement('afterbegin', logo);
