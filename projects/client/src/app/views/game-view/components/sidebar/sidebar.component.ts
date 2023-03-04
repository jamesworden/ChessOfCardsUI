import { Component, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { ResetGameData } from 'projects/client/src/app/actions/game.actions';
import { UpdateView } from 'projects/client/src/app/actions/view.actions';
import { SignalrService } from 'projects/client/src/app/services/SignalRService';
import { SubscriptionManager } from 'projects/client/src/app/util/subscription-manager';
import { View } from '../../..';
import { ResponsiveSizeService } from '../../services/responsive-size.service';
import { ModalData } from '../modal/modal-data';
import { ModalComponent } from '../modal/modal.component';

enum ResignModalButtons {
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

  @Input() showDrawOptions = false;

  cardSize: number;

  constructor(
    public responsiveSizeService: ResponsiveSizeService,
    public modal: MatDialog,
    private store: Store,
    private signalrService: SignalrService
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
      buttons: [ResignModalButtons.Yes, ResignModalButtons.No],
    };

    const modalRef = this.modal.open(ModalComponent, {
      width: '250px',
      data: modalData,
    });

    modalRef.componentInstance.buttonClicked.subscribe((selectedOption) => {
      if (selectedOption === ResignModalButtons.No) {
        modalRef.close();
      } else {
        this.signalrService.offerDraw();
        modalRef.close();
      }
    });
  }

  openAcceptDrawModal() {
    console.log('Accept draw.');
  }

  denyDraw() {
    console.log('Deny draw.');
  }
}
