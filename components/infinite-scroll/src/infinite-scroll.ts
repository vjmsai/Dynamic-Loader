import { html, customElement, LitElement, property } from 'lit-element';


@customElement('infinite-scroll')
export default class InfiniteScroll extends LitElement {
  /**
   * This variable stores the threshold element, and scrolling beyond this element will trigger (onScroll) event.
   */
  _thresholdElement: HTMLElement| undefined;

   /**
   * This property is used to set page number
   */
    @property({type: Number, reflect: true, attribute: 'page-number'})
    pageNumber = 0;

    observer: IntersectionObserver | undefined;
    render() {
      return html`
        <slot></slot>
      `;
    }

    updated(changedProperties) {
      if(changedProperties.has('pageNumber')) {
        this._thresholdElement = this.querySelector('[threshold]') as HTMLElement;
        this.createObserver();
      }
    }
  
    createObserver() {
      this.observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting){
          this._handleScroll();
        }
      }, {});
  
      if (this._thresholdElement)
      {
        this.observer.observe(this._thresholdElement);
      }
    }
  
    /**
     *   This method will create event on Scroll.
     */
    private _handleScroll() {
      if(this._thresholdElement) {
        this._thresholdElement.remove();
      }
      const scroll = new CustomEvent("onScroll");
      this.dispatchEvent(scroll);
    }
}  
  
