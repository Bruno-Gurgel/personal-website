import logoUdacity from '../img/udacity.png';
import blogImage from '../img/blog.jpg';
import landingPageImage from '../img/landing-page.png';
import weatherImage from '../img/weather.jpg';
import newsImage from '../img/news.jpg';
import travelImage from '../img/travel.jpg';

const loadImages = document.addEventListener('DOMContentLoaded', () => {
  const useImage = (id, alias, caption) => {
    const image = document.getElementById(id);
    image.src = alias;
    image.alt = caption;
  };

  useImage('design-patterns', logoUdacity, "Udacity's Logo");
  useImage('blog-fend', blogImage, "Table with 'Blog' written in the middle");
  useImage('landing-page-fend', landingPageImage, 'Landing page template');
  useImage('weather-fend', weatherImage, 'Clouds with orange shadow');
  useImage(
    'news-fend',
    newsImage,
    'Writing machine with a paper written "news" in it'
  );
  useImage(
    'travel-fend',
    travelImage,
    'Brown luggage with some stickers in it'
  );
});

export { loadImages };
