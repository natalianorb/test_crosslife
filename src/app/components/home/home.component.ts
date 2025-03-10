import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { Region } from '../../models/region';
import { RegionsService } from '../../services/regions.service';
import { TypeaheadComponent } from '../typeahead/typeahead.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { regionsListValidator } from '../../helpers/regions-list.validator';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, MatButtonModule, MatChipsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  private regionService = inject(RegionsService);
  regions: Region[] = [];
  selectedRegions = signal<number[]>([]);
  selectedRegion = signal<number | null>(null);
  private overlay = inject(Overlay);
  private typeaheadPortal = new ComponentPortal(TypeaheadComponent);
  private typeaheadRef!: ComponentRef<TypeaheadComponent>;
  private overlayConfig = new OverlayConfig({
    hasBackdrop: true,
    backdropClass: 'cdk-overlay-dark-backdrop',
    positionStrategy: this.overlay
      .position()
      .global()
      .bottom('0')
      .centerHorizontally(),
    minWidth: '375px',
    width: '100vw',
    height: '98vh',
  });
  private overlayRef = this.overlay.create(this.overlayConfig);
  form = new FormGroup({
    firstInput: new FormControl<number[]>([], regionsListValidator),
    secondInput: new FormControl<number | null>(null, Validators.required),
  });

  get firstInput() {
    return this.form.get('firstInput')!;
  }

  get secondInput() {
    return this.form.get('secondInput')!;
  }

  ngOnInit() {
    this.regionService.getRegions().subscribe((regions) => {
      this.regions = regions;
      this.initOverlay();
    });
  }

  private initOverlay() {
    this.overlayRef.backdropClick().subscribe(() => this.overlayRef.detach());
  }

  openOverlay(isMultiple: boolean) {
    this.typeaheadRef = this.overlayRef.attach(this.typeaheadPortal);

    const typeaheadRef = this.typeaheadRef;
    const region = this.selectedRegion();
    const singleRegionList = region ? [region] : [];

    typeaheadRef.setInput('items', this.regions);

    typeaheadRef.instance.selectedItems = isMultiple
      ? this.selectedRegions()
      : singleRegionList;
    typeaheadRef.instance.isMultiple = isMultiple;

    typeaheadRef.instance.selectionChange.subscribe((selectedItems) => {
      this.setSelectedRegions(isMultiple, selectedItems);
      this.overlayRef.detach();
    });

    typeaheadRef.instance.selectionCancel.subscribe(() => {
      this.overlayRef.detach();
    });
  }

  private setSelectedRegions(isMultiple: boolean, data: number[]) {
    if (isMultiple) {
      this.selectedRegions.set(data);
      this.firstInput.setValue(data);
      this.firstInput.markAsTouched();
    } else {
      this.selectedRegion.set(data[0]);
      this.secondInput.setValue(data[0]);
    }
  }

  onSubmit() {
    console.log(this.form.value);
  }

  getRegionName(regionId: number) {
    const foundRegion = this.regions.find((region) => region.id === regionId);
    return foundRegion ? foundRegion.name : '';
  }

  ngOnDestroy(): void {
    this.overlayRef.dispose();
  }
}
