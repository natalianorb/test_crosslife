import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Item, SelectableItem } from '../../models/item';
import { MatRadioModule } from '@angular/material/radio';
import { computed } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { BackwardIconComponent } from "../backward-icon/backward-icon.component";
import { RoundCheckboxComponent } from "../round-checkbox/round-checkbox.component";
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-typeahead',
  imports: [
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatButtonModule,
    BackwardIconComponent,
    RoundCheckboxComponent,
    ScrollingModule,
    MatDividerModule,
  ],
  templateUrl: './typeahead.component.html',
  styleUrl: './typeahead.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypeaheadComponent implements OnInit, OnChanges {
  searchControl = new FormControl('');
  private searchTerm = signal('');
  @Input() items: Item[] = [];
  @Input() isMultiple = false;
  @Input() selectedItems: number[] = [];
  @Input() title = 'Выбрать из списка';
  @Output() selectionCancel = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<number[]>();

  filteredItems = computed(() => {
    const term = this.searchTerm();
    const allItems = this.items;

    if (!term) return allItems.map(this.getSelectableItem);

    return allItems
      .filter((item) => item.name.toLowerCase().includes(term))
      .map(this.getSelectableItem);
  });

  private workingSelectedValues: number[] = [];

  ngOnInit() {
    this.searchControl.valueChanges.subscribe((value) => {
      const normalizedQuery = value?.trim().toLowerCase();
      this.searchTerm.set(normalizedQuery ?? '');
    });
  }

  ngOnChanges() {
    this.workingSelectedValues = [...this.selectedItems];
  }

  cancelChanges() {
    this.selectionCancel.emit();
  }

  confirmChanges() {
    this.selectionChange.emit(this.workingSelectedValues);
  }

  onCheckboxChange(option: { value: number; checked: boolean }) {
    this.updateWorkingSelectedValues(option);
  }

  onRadioChange(value: number) {
    this.updateWorkingSelectedValues({ checked: true, value });
  }

  private updateWorkingSelectedValues({
    checked,
    value,
  }: {
    checked: boolean;
    value: number;
  }) {
    if (!this.isMultiple) {
      this.workingSelectedValues = [value];
      return;
    }

    if (checked) {
      this.workingSelectedValues = [...this.workingSelectedValues, value];
    } else {
      this.workingSelectedValues = this.workingSelectedValues.filter(
        (item) => item !== value,
      );
    }
  }

  private getSelectableItem = (item: Item): SelectableItem => ({
    ...item,
    selected: this.selectedItems.includes(item.id),
  });
}
