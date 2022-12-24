import { of } from 'rxjs';

of(1, 2, 3).subscribe(async (a) => {
  console.log(a);

  console.log(`Done with ${a}`);
});
