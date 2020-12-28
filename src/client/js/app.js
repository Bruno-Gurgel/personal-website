const appFunctions = document.addEventListener('DOMContentLoaded', () => {
  const model = {};

  const controller = {
    init() {
      this.repoButtons = document.getElementsByClassName('projects__repo');

      this.openRepo();
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
    init() {},
    render() {},
  };

  controller.init();
});

export { appFunctions };
