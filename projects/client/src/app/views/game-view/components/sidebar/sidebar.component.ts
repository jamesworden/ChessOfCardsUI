import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
export class SidebarComponent {
  constructor(
    public responsiveSizeService: ResponsiveSizeService,
    public modal: MatDialog
  ) {}

  onResign() {
    const modalData: ModalData = {
      message: 'Are you sure you want to resign?',
      buttons: [ResignModalButtons.Yes, ResignModalButtons.No],
    };
    const modalRef = this.modal.open(ModalComponent, {
      width: '250px',
      data: modalData,
    });

    modalRef.componentInstance.buttonClicked.subscribe((selectedOption) => {
      if (selectedOption === ResignModalButtons.No) {
        modalRef.close();
      } else if (selectedOption === ResignModalButtons.Yes) {
        console.log('resign');
      }
    });

    modalRef.afterClosed().subscribe(() => {
      modalRef.componentInstance.buttonClicked.unsubscribe();
    });
  }
}
