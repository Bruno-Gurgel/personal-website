import './style/blog/main.css';

import blogPostImage from './img/blog/blog-post.webp';
import blogAvatarImage from './img/blog/avatar.webp';

const images = document.getElementsByClassName('blog-img');
for (const image of images) {
  image.src = blogPostImage;
}

const avatar = document.querySelector('.img');
avatar.src = blogAvatarImage;
