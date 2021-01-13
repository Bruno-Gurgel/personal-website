const appFunctions = document.addEventListener('DOMContentLoaded', () => {
  const model = {};

  const controller = {
    init() {
      this.projectThumbnails = document.getElementsByClassName(
        'projects__figure'
      );
      this.lastButtonsOfThumbnails = document.getElementsByClassName(
        'projects__button'
      );

      view.init();
    },
    /*
    Hover states are inaccessible for keyboard users initially.
    This function solves this problem
    */
    tabWithinHover() {
      for (const project of this.projectThumbnails) {
        project.addEventListener('blur', () => {
          /* 
          When the user leaves the focus of the figure element, the display of the respective figcaption is set to block with an inline style, otherwise the figcaptio would not appear and by pressing tab the user would go to the next figure
          */
          const figCaption = project.lastElementChild;
          figCaption.style.display = 'block';
          for (const lastButton of this.lastButtonsOfThumbnails) {
            /*  
            When the user leaves the focus of the last button inside the figcaption, remove the inline style of the figcaption
            */
            lastButton.onblur = () => {
              figCaption.style.display = '';
            };
          }
        });
      }
    },
  };

  const view = {
    init() {
      this.render();
    },
    render() {
      controller.tabWithinHover();
    },
  };

  controller.init();
});

export { appFunctions };
