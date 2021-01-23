// WEBP Images
import blogImage from '../img/blog.webp';
import landingPageImage from '../img/landing-page.webp';
import weatherImage from '../img/weather.webp';
import newsImage from '../img/news.webp';
import travelImage from '../img/travel.webp';

// Fallback Images (jpeg)
import fallbackBlogImage from '../img/fallback/blog.jpg';
import fallbackLandingPageImage from '../img/fallback/landing-page.jpg';
import fallbackWeatherImage from '../img/fallback/weather.jpg';
import fallbackNewsImage from '../img/fallback/news.jpg';
import fallbackTravelImage from '../img/fallback/travel.jpg';

const loadImages = document.addEventListener('DOMContentLoaded', () => {
  const useImage = (id, alias, caption) => {
    const image = document.getElementById(id);
    image.srcset = alias;
    image.alt = caption;
  };

  // WEBP Images
  useImage(
    'blog-fend--webp',
    blogImage,
    "Table with 'Blog' written in the middle"
  );
  useImage(
    'landing-page-fend--webp',
    landingPageImage,
    'Landing page template'
  );
  useImage('weather-fend--webp', weatherImage, 'Clouds with orange shadow');
  useImage(
    'news-fend--webp',
    newsImage,
    'Writing machine with a paper written "news" in it'
  );
  useImage(
    'travel-fend--webp',
    travelImage,
    'Brown luggage with some stickers in it'
  );

  const useFallbackImage = (id, alias, caption) => {
    const image = document.getElementById(id);
    image.src = alias;
    image.alt = caption;
  };

  // Fallback Images (jpeg)
  useFallbackImage(
    'blog-fend--fallback',
    fallbackBlogImage,
    "Table with 'Blog' written in the middle"
  );
  useFallbackImage(
    'landing-page-fend--fallback',
    fallbackLandingPageImage,
    'Landing page template'
  );
  useFallbackImage(
    'weather-fend--fallback',
    fallbackWeatherImage,
    'Clouds with orange shadow'
  );
  useFallbackImage(
    'news-fend--fallback',
    fallbackNewsImage,
    'Writing machine with a paper written "news" in it'
  );
  useFallbackImage(
    'travel-fend--fallback',
    fallbackTravelImage,
    'Brown luggage with some stickers in it'
  );
});

export { loadImages };
