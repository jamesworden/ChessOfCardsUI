import { Component, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import {
  AcceptDrawOffer,
  DenyDrawOffer,
  OfferDraw,
} from 'projects/client/src/app/actions/game.actions';
import { GameState } from 'projects/client/src/app/state/game.state';
import { SubscriptionManager } from 'projects/client/src/app/util/subscription-manager';
import { ResponsiveSizeService } from '../../services/responsive-size.service';
import { ModalData } from '../modal/modal-data';
import { ModalComponent } from '../modal/modal.component';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

enum YesNoButtons {
  Yes = 'Yes',
  No = 'No',
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnDestroy {
  private sm = new SubscriptionManager();

  @Select(GameState.hasPendingDrawOffer)
  hasPendingDrawOffer$!: Observable<boolean>;

  @Select(GameState.drawOfferSent)
  drawOfferSent$!: Observable<boolean>;

  cardSize: number;
  drawOfferSent: boolean;

  constructor(
    public responsiveSizeService: ResponsiveSizeService,
    public modal: MatDialog,
    private store: Store,
    private snackBar: MatSnackBar
  ) {
    this.sm.add(
      responsiveSizeService.cardSize$.subscribe((cardSize) => {
        this.cardSize = cardSize;
      })
    );
    this.sm.add(
      this.drawOfferSent$.subscribe((drawOfferSent) => {
        this.drawOfferSent = drawOfferSent;
      })
    );
  }

  ngOnDestroy() {
    this.sm.unsubscribe();
  }

  attemptToOpenOfferDrawModel() {
    if (this.drawOfferSent) {
      this.snackBar.open('You already offered a draw.', undefined, {
        duration: 2000,
        verticalPosition: 'top',
      });
    } else {
      this.openOfferDrawModal();
    }
  }

  openOfferDrawModal() {
    const modalData: ModalData = {
      message: 'Are you sure you want to offer a draw?',
      buttons: [YesNoButtons.Yes, YesNoButtons.No],
    };

    const modalRef = this.modal.open(ModalComponent, {
      width: '250px',
      data: modalData,
    });

    modalRef.componentInstance.buttonClicked.subscribe((selectedOption) => {
      if (selectedOption === YesNoButtons.Yes) {
        this.store.dispatch(new OfferDraw());
      }

      modalRef.close();
    });
  }

  acceptDraw() {
    this.store.dispatch(new AcceptDrawOffer());
  }

  denyDraw() {
    this.store.dispatch(new DenyDrawOffer());
  }
}
