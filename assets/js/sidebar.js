document.addEventListener('DOMContentLoaded', function () {
  var root = document.getElementById('sidebar-root');
  if (!root) return;

  root.innerHTML = '\
  <button class="menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="sidebar">\u2630 Menu</button>\
  <div class="overlay"></div>\
  <aside class="sidebar" id="sidebar">\
    <canvas id="particle-canvas"></canvas>\
    <div class="sidebar-content">\
      <img class="sidebar-photo" src="assets/me.jpeg" alt="Sakshi Bhatia">\
      <h1>Sakshi Bhatia</h1>\
      <div class="sidebar-tagline">Building robots that generalize.</div>\
      <div class="sidebar-divider"></div>\
      <nav class="sidebar-nav">\
        <a href="#about">About</a>\
        <a href="#research">Research</a>\
        <a href="#projects">Projects</a>\
        <a href="#experience">Experience</a>\
        <a href="#awards">Awards</a>\
      </nav>\
      <div class="sidebar-social">\
        <a href="mailto:sakshib.grads@gmail.com">Email</a>\
        <a href="https://github.com/sakshi79">GitHub</a>\
        <a href="https://www.linkedin.com/in/sakshi-bhatia-sb/">LinkedIn</a>\
        <a href="https://medium.com/@sakshi77">Medium</a>\
        <a href="assets/Sakshi_Bhatia_CV.pdf">CV</a>\
      </div>\
    </div>\
  </aside>';
});
