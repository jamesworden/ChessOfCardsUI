import { Component } from '@angular/core';
import { ResponsiveSizeService } from '../../services/responsive-size.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  constructor(public responsiveSizeService: ResponsiveSizeService) {}
}
