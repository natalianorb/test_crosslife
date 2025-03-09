import { Component, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-backward-icon',
  imports: [MatIconModule],
  templateUrl: './backward-icon.component.html',
  styleUrl: './backward-icon.component.scss',
})
export class BackwardIconComponent {
  constructor() {
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);

    iconRegistry.addSvgIcon(
      'backward',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/Arrow.svg'),
    );
  }
}
