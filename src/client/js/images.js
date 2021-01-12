import blogImage from '../img/blog.webp';
import landingPageImage from '../img/landing-page.webp';
import weatherImage from '../img/weather.webp';
import newsImage from '../img/news.webp';
import travelImage from '../img/travel.webp';

const loadImages = document.addEventListener('DOMContentLoaded', () => {
  const useImage = (id, alias, caption) => {
    const image = document.getElementById(id);
    image.src = alias;
    image.alt = caption;
  };

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
