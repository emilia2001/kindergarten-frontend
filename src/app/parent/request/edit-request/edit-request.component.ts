import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-edit-request',
  templateUrl: './edit-request.component.html',
  styleUrls: ['./edit-request.component.scss']
})
export class EditRequestComponent  implements OnInit {
  isLoading: any;
  requestType!: string | null;
  idParam!: string | null;
  comments!: string | null;

  constructor(
    private _route: ActivatedRoute,
  ) {
  }


  ngOnInit(): void {
    this.idParam = this._route.snapshot.paramMap.get('id');
    this._route.queryParams.subscribe(params => {
      this.requestType = params['type'];
      this.comments = params['comments'];
    });
  }

}
