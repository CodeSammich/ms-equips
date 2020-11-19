import twitch_logo from './images/twitch_logo.svg';
import youtube_logo from './images/youtube_logo.svg';

function Footer() {
  // Replace with proper Social Media library buttons later
  // https://www.w3schools.com/howto/howto_css_social_media_buttons.asp
  return (
    <footer className="App-footer">
      <p className="footer-text"> This website was built by Nox. </p>
      <a href="https://twitch.tv/code_nox" target="_blank">
        <img className="footer-icons" alt="Twitch Logo" src={twitch_logo} />
      </a>
      <a href="https://www.youtube.com/c/NoxStream" target="_blank">
        <img className="footer-icons" alt="Youtube Logo" src={youtube_logo} />
      </a>
    </footer>
  );
}

export default Footer;