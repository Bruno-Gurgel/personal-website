import './style/blog/main.css';

import blogPostImage from './img/blog/blog-post.webp';
import blogAvatarImage from './img/blog/avatar.webp';
import fallbackBlogPostImage from './img/blog/fallback/blog-post.jpg';
import fallbackBlogAvatarImage from './img/blog/fallback/avatar.png';

const images = document.getElementsByClassName('--webp');
for (const source of images) {
  source.srcset = blogPostImage;
}

const fallbackImages = document.getElementsByClassName('--fallback');
for (const image of fallbackImages) {
  image.src = fallbackBlogPostImage;
}

const avatar = document.querySelector('.main__avatar__img--webp');
avatar.srcset = blogAvatarImage;

const fallbackAvatar = document.querySelector('.main__avatar__img--fallback');
fallbackAvatar.src = fallbackBlogAvatarImage;
