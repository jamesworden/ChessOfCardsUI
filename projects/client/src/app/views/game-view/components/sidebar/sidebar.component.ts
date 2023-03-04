import { Component, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import {
  AcceptDrawOffer,
  DenyDrawOffer,
  OfferDraw,
  ResetGameData,
} from 'projects/client/src/app/actions/game.actions';
import { UpdateView } from 'projects/client/src/app/actions/view.actions';
import { SignalrService } from 'projects/client/src/app/services/SignalRService';
import { SubscriptionManager } from 'projects/client/src/app/util/subscription-manager';
import { ResponsiveSizeService } from '../../services/responsive-size.service';
import { ModalData } from '../modal/modal-data';
import { ModalComponent } from '../modal/modal.component';

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

  @Input() hasPendingDrawOffer = false;

  cardSize: number;

  constructor(
    public responsiveSizeService: ResponsiveSizeService,
    public modal: MatDialog,
    private store: Store
  ) {
    this.sm.add(
      responsiveSizeService.cardSize$.subscribe((cardSize) => {
        this.cardSize = cardSize;
      })
    );
  }

  ngOnDestroy() {
    this.sm.unsubscribe();
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

  openAcceptDrawModal() {
    const modalData: ModalData = {
      message: 'Are you sure you want to draw?',
      buttons: [YesNoButtons.Yes, YesNoButtons.No],
    };

    const modalRef = this.modal.open(ModalComponent, {
      width: '250px',
      data: modalData,
    });

    modalRef.componentInstance.buttonClicked.subscribe((selectedOption) => {
      if (selectedOption === YesNoButtons.Yes) {
        this.store.dispatch(new AcceptDrawOffer());
      }

      modalRef.close();
    });
  }

  denyDraw() {
    this.store.dispatch(new DenyDrawOffer());
  }
}
