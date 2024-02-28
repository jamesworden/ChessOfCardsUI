import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { ServerState } from '../../state/server.state';
import { ModalComponent } from '../game-view/components/modal/modal.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConnectToServer } from '../../actions/server.actions';
import { Router } from '@angular/router';
import { ResponsiveSizeService } from '../game-view/services/responsive-size.service';
import { Breakpoint } from '../../models/breakpoint.model';

@Component({
  selector: 'app-play-as-guest-view',
  templateUrl: './play-as-guest-view.component.html',
  styleUrls: ['./play-as-guest-view.component.css'],
})
export class PlayAsGuestViewComponent {
  readonly Breakpoint = Breakpoint;

  readonly #router = inject(Router);
  readonly #store = inject(Store);
  readonly #modal = inject(MatDialog);
  readonly #responsiveSizeService = inject(ResponsiveSizeService);

  readonly breakpoint$ = this.#responsiveSizeService.breakpoint$;
  readonly onHostGameCollapsedOption$ = new BehaviorSubject<boolean>(true);

  goBack() {
    this.#router.navigate(['host']);
  }

  openRetryConnectionModal() {
    const modalRef = this.#modal.open(ModalComponent, {
      width: '250px',
      data: {
        message: 'Could not connect to the server! Please try again.',
      },
    });

    modalRef.afterClosed().subscribe(() => {
      this.#store.dispatch(new ConnectToServer());
    });
  }
}
