import { Component,inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LanguageService } from '../core/services/language.service';
import { SidebarComponent } from '../layouts/sidebar/sidebar.component';
import { TopbarComponent } from '../layouts/topbar/topbar.component';
import { CustomizerComponent } from '../layouts/customizer/customizer.component';

import {GestionProjetComponent } from '../gestion-projet/gestion-projet.component';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent,RouterModule,CustomizerComponent,GestionProjetComponent],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss',
  providers:[LanguageService]
})
export class KanbanComponent {
  private store = inject(Store)

  layoutType!: string;
  constructor() {
  }
  ngOnInit() {
    this.store.select('layout').subscribe((data:any) => {
      this.layoutType = data.LAYOUT;
      document.documentElement.setAttribute('data-layout', data.LAYOUT);
      document.documentElement.setAttribute('data-sidebar', data.SIDEBAR_COLOR);
      data.LAYOUT == "vertical" ? document.documentElement.setAttribute('data-sidebar-size', data.SIDEBAR_SIZE) : '';
      document.documentElement.setAttribute('data-mode', data.LAYOUT_MODE);
      document.documentElement.setAttribute('data-topbar', data.TOPBAR_COLOR);
      document.documentElement.setAttribute('data-skin', data.LAYOUT_SKIN)
      document.documentElement.setAttribute('data-navbar', data.LAYOUT_NAVIGATION);
      document.documentElement.setAttribute('data-content', data.LAYOUT_WIDTH);
      document.documentElement.setAttribute('dir', data.LAYOUT_DIRECTION);
    })
  }
}