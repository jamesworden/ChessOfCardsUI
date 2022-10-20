import { Component } from '@angular/core';
import { ResponsiveSizeService } from '../responsive-size.service';

@Component({
  selector: 'app-face-down-card',
  templateUrl: './face-down-card.component.html',
  styleUrls: ['./face-down-card.component.css'],
})
export class FaceDownCardComponent {
  constructor(public responsiveSizeService: ResponsiveSizeService) {}
}
