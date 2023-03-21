export default class LoadMoreBtn {
  constructor({ selector, hidden = false }) {
    this.refs = this.getRefs(selector);

    hidden && this.hide();
  }

  getRefs(selector) {
    const refs = {};

    refs.button = document.querySelector(selector);
    refs.spinner = refs.button.querySelector('.spinner-border');
    refs.label = refs.button.querySelector('.label');

    return refs;
  }

  enable() {
    this.refs.button.disabled = false;
    this.refs.spinner.classList.add('is-hidden');
    this.refs.label.textContent = 'Load more';
  }

  disable() {
    this.refs.button.disabled = true;
    this.refs.spinner.classList.remove('is-hidden');
    this.refs.label.textContent = 'Loading...';
  }

  show() {
    this.refs.button.classList.remove('is-hidden');
  }

  hide() {
    this.refs.button.classList.add('is-hidden');
  }
}
