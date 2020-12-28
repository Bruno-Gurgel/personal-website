const appFunctions = document.addEventListener('DOMContentLoaded', () => {
  /* const model = {
    
  }; */

  const controller = {
    init() {
      this.repoButtons = document.getElementsByClassName('projects__repo');
      this.projects = document.getElementsByClassName('projects__figure');
      this.projectsList = document.querySelector('.nav__submenu');

      view.init();

      this.createSubMenu();
      this.openRepo();
    },
    createSubMenu() {
      const fragment = document.createDocumentFragment();
      for (const project of this.projects) {
        const newElement = document.createElement('li');
        newElement.innerHTML = `<a class="nav__submenu__item"  href="#"> ${project.dataset.submenu}</a>`;
        fragment.appendChild(newElement);
        this.projectsList.appendChild(fragment);
      }
    },
    openRepo() {
      for (const btn of this.repoButtons) {
        btn.addEventListener('click', () => {
          console.log(btn);
          window.open(`https://github.com/Bruno-Gurgel/${btn.name}`);
        });
      }
    },
  };

  const view = {
    init() {
      this.navProjects = document.querySelector('.--project');
      this.projectsList = document.querySelector('.nav__submenu');

      this.render();
    },
    render() {
      this.navProjects.addEventListener('click', () => {
        this.projectsList.classList.toggle('visible');
      });
    },
  };

  controller.init();
});

export { appFunctions };
