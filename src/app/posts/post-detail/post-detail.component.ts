import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Subject } from 'rxjs/Subject';
import { client } from '../graphql.client';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { PostByIdInterface } from '../graphql/schema';
import { GetPostDetailQuery } from '../graphql/queries';

@Component({
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']

})

export class PostDetailComponent implements OnInit, OnDestroy {

  public postControl = new FormControl();
  public nameFilter: Subject<string> = new Subject<string>();
  public id;
  public pageTitle: string = 'Post detail:';
  public post: any;
  public errorMessage: string;
  private apollo: Apollo;
  // Observable variable of the graphql query
  private sub: Subscription;

  // Inject Angular2Apollo service
  constructor(apollo: Apollo, private route: ActivatedRoute) {
    this.apollo = apollo;
  }

  public ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.id = params['id'];
    });
    this.apollo.watchQuery<PostByIdInterface>({
      query: GetPostDetailQuery,
      variables: {id: this.id}
    }).subscribe(({data}) => {
      this.post = data.post;
    });
  }

  public ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
