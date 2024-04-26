// sidebar.component.ts

import { Component, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Output() logoutEvent = new EventEmitter<void>();

  logout() {
    this.logoutEvent.emit();
  }

  collapsedSections: { [key: string]: boolean } = {};

  toggleCollapse(section: string): void {
    this.collapsedSections[section] = !this.collapsedSections[section];
  }

  isCollapsed(section: string): boolean {
    return this.collapsedSections[section];
  }
}
