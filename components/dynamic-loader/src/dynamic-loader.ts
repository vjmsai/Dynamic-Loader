import { html, customElement, LitElement, property } from 'lit-element';
import { Hookable } from 'own hookable sdk';

export interface DynamicElementLoaderProps {
  async?: boolean;
  defer?: boolean;
  hideElement?: boolean;
  showScript?: boolean;
  moduleUrl?: string;
  url?: string;
  tag?: string;
  props?: string;
  events?: string;
}

@customElement('dynamic-element-loader')
@Hookable({
  selector: 'dynamic-element-loader',
  hooks: ['updated', 'firstUpdated'],
})
export default class DynamicLoader extends LitElement {
  /**
   * This property is used to set fetching resource in async way.
   */
  @property({type: Boolean, reflect: true, attribute: 'async'})
  async = false;
  /**
   * This property is used to set fetching resource in defer way.
   */
  @property({type: Boolean, reflect: true, attribute: 'defer'})
  defer= false;
  /**
   * This property is used to set fetching resource in defer way.
   */
  @property({ type: Boolean, reflect: true, attribute: 'hide-element' })
  hideElement = false;
  /**
   * This property is used to show the script in head tag, by default we will remove this script once it is loaded.
   */
  @property({ type: Boolean, reflect: true, attribute: 'show-script' })
  showScript = false;
  /**
   * This property is used to get the moduleUrl from where the resources while be fetched
   */
  @property({ type: String, reflect: true, attribute: 'module-url' })
  moduleUrl = '';
  /**
   * This property is used to get the url from where the resources while be fetched
   */
   @property({ type: String, reflect: true, attribute: 'url' })
   url = '';
  /**
   * Tag Name for loaded component
   */
   @property({ type: String, reflect: true })
   tag = '';

   /**
   * stringified JSON props which would be passed down to loaded component
   */
    @property({ type: String })
    props = '';

  /**
   * stringified Arrays of events name which would be attached to the loaded component
   */
    @property({ type: String, reflect: true })
    events = '';

  /**
   * Private Dynamic Component Elements
   */
   private hasRendered = false;
   private isLoading = false;
   private hasLoaded = false;
   private hasErrors = false;
   private arePropsAttached = true;
   private arePropsValid = true;
   private element;

   firstUpdated() {
    this.element = document.createElement(this.tag);
    this.updateListeners('addEventListener');
    if (!customElements.get(this.tag)) {
      this.importModule();
    } else {
      this.setScriptState(null, true, false);
    }
  }

  importModule() {
    const script = this.createScript();
    document.head.appendChild(script);
    this.addEventListenersOnScript(script);
    this.isLoading = true;
    this.requestUpdate();
  }

   createCustomEvent(eventName, details) {
    const customEvent = new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: details,
    });
    return customEvent;
  }

  private addEventListenersOnScript(script: HTMLScriptElement) {
    script.onload = () => {
      this.setScriptState(script, true, false);
    };

    script.addEventListener('error', () => {
      this.setScriptState(script, false, true);
    });
  }

  setScriptState(script: HTMLScriptElement | null, hasLoaded, hasErrors) {
    this.isLoading = false;
    this.hasLoaded = hasLoaded;
    this.hasErrors = hasErrors;
    this.requestUpdate();
    if (!this.showScript && script) {
      script.remove();
    }
  }

  createScript(): HTMLScriptElement {
    const script = document.createElement('script') as HTMLScriptElement;
    if ('noModule' in HTMLScriptElement.prototype && this.moduleUrl) {
      script.src = this.moduleUrl;
      script.type = 'module';
    } else {
      script.src = this.url;
      script.type = 'text/javascript';
    }

    if (this.defer) {
      script.setAttribute('defer', '');
    }

    if (this.async) {
      script.setAttribute('async', '');
    }
    return script;
  }


   updateListeners(listener: 'addEventListener' | 'removeEventListener') {
    if (this.events) {
      const events = this.events.replace(/ /g, '').split(',');
      const listenersCallbackFn = (val) => {
        this.dispatchEvent(this.createCustomEvent(val.type, val.detail));
      };
      events.forEach((event) => {
        this.element[listener](event, listenersCallbackFn);
      });
    }
  }

   setProps(props) {
    try {
      let parsedProps = props;
      if (typeof parsedProps === 'string') {
        parsedProps = JSON.parse(parsedProps);
      }
      parsedProps &&
        Object.keys(parsedProps).forEach((key) => {
          let value;
          if (typeof parsedProps[key] === 'string') {
            value = parsedProps[key];
          } else {
            value = JSON.stringify(parsedProps[key]);
          }
          this.element.setAttribute(key, value);
        });
      this.setPropsState(true);
    } catch (error) {
      this.setPropsState(false);
    }
  }

   setPropsState(status: boolean) {
    this.arePropsAttached = status;
    this.arePropsValid = status;
  }

   renderElement() {
    this.hasRendered = true;
    return html`
      ${this.element}
    `;
  }

  renderLoader() {
    return html`
      <slot name="loader"></slot>
    `;
  }

  renderErrorMessage() {
    return html`
      <slot name="error"></slot>
    `;
  }

  render() {
    if (this.isLoading) {
      return this.renderLoader();
    }
    if (this.hasErrors) {
      return this.renderErrorMessage();
    }
    if (this.element && !this.hideElement) {
      this.setProps(this.props);
      return this.renderElement();
    }
    return html``;
  }

  updated() {
    if (this.hasRendered) {
      this.dispatchEvent(
        this.createCustomEvent('loaded', {
          elementRef: this.element,
        }),
      );
    }
    this.dispatchState();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.updateListeners('removeEventListener');
  }

  dispatchState() {
    const detail = {
      tag: this.tag,
      hasRendered: this.hasRendered,
      isLoading: this.isLoading,
      hasLoaded: this.hasLoaded,
      hasErrors: this.hasErrors,
      arePropsAttached: this.arePropsAttached,
      arePropsValid: this.arePropsValid,
    };
    this.dispatchEvent(this.createCustomEvent('status', detail));
  }

}
