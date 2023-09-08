import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  NgZone,
} from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { map, pairwise, startWith } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public message: string = 'Msg init';

  constructor(private zone: NgZone) {}

  public printMe(): void {
    window.print();
  }

  //1.When printing from window.print() how make the difference between: Print & Cancel click ?
  //2.//How to detect print button from Iframe toolbar=1?
  ngOnInit() {
    console.log('init');
    
    const mediaQuery = window.matchMedia('print')
    mediaQuery.addEventListener('print', () => {
      alert('mediaQuery-print')
    })


    //KO
    this.media('print')
      .pipe(pairwise())
      .subscribe(([print, notPrint]) => {
        console.log('init-print');
        if (print && !notPrint) alert('Print');
        if (!print && notPrint)  alert('Cancel');
      });
  }

  //https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeprint_event
  @HostListener('window:beforeprint', ['$event'])
  onBeforePrint() {
    alert('onBeforePrint');
    console.log('onBeforePrint');
    this.message = 'onBeforePrint triggered ';
    let e;
  }

  ////https://developer.mozilla.org/en-US/docs/Web/API/Window/afterprint_event
  @HostListener('window:afterprint', ['$event'])
  onAfterPrint() {
    alert('onAfterPrint');
    
    console.log('onAfterPrint');
    this.message = 'onAfterPrint triggered ';
  }

  //https://stackoverflow.com/questions/66649080/windowafterprint-not-working-after-window-print-in-angular
  media(query: string): Observable<boolean> {
    console.log('media')
    const mediaQuery = window.matchMedia(query);
    return fromEvent<MediaQueryList>(mediaQuery, 'change').pipe(
      startWith(mediaQuery),
      map((list: MediaQueryList) => list.matches)
    );
  }
}
