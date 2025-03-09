import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatListModule, MatListOption } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Item } from '../../models/item';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-typeahead',
  imports: [MatListModule, MatFormFieldModule, MatInputModule, MatRadioModule],
  templateUrl: './typeahead.component.html',
  styleUrl: './typeahead.component.scss',
})
export class TypeaheadComponent {
  @Input() items: Item[] = [];
  @Input() isMultiple = false;
  @Input() selectedItems: number[] = [];
  @Input() title = 'Выбрать из списка';

  @Output() selectionCancel = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<number[]>();

  filteredItems: Item[] = [];
  workingSelectedValues: number[] = [];

  ngOnChanges() {
    this.filteredItems = [...this.items];
    this.workingSelectedValues = [...this.selectedItems];
  }

  cancelChanges() {
    this.selectionCancel.emit();
  }

  confirmChanges() {
    this.selectionChange.emit(this.workingSelectedValues);
  }

  onCheckboxChange(option: MatListOption) {
    const { value, selected } = option;
    this._updateWorkingSelectedValues({ checked: selected, value });
  }

  onRadioChange(value: number) {
    this._updateWorkingSelectedValues({ checked: true, value });
  }

  private _updateWorkingSelectedValues({
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

  filterItems(event: Event | null) {
    if (!event) {
      return this._filter(undefined);
    }
    const inputElement = event.target as HTMLInputElement;
    this._filter(inputElement.value);
  }

  private _filter(searchQuery: string | undefined) {
    if (searchQuery === undefined || searchQuery.trim() === '') {
      this.filteredItems = [...this.items];
    } else {
      const normalizedQuery = searchQuery.toLowerCase();
      this.filteredItems = this.items.filter((item) =>
        item.name.toLowerCase().includes(normalizedQuery),
      );
    }
  }
}
