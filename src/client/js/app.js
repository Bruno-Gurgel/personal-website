const appFunctions = document.addEventListener('DOMContentLoaded', () => {
  const model = {
    repoButtons: document.getElementsByClassName('projects__repo'),
  };

  const controller = {
    init() {
      this.openRepo();
    },
    openRepo() {
      for (const btn of model.repoButtons) {
        btn.addEventListener('click', () => {
          console.log(btn);
          window.open(`https://github.com/Bruno-Gurgel/${btn.name}`);
        });
      }
    },
  };

  controller.init();
});

export { appFunctions };
