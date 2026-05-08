import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { switchMap, map } from 'rxjs/operators';

interface PreSignedUrlResponse {
  url?: string;
  uploadUrl?: string;
  signedUrl?: string;
}

@Injectable()
export class ManageProductsService extends ApiService {
  uploadProductsCSV(file: File): Observable<unknown> {
    if (!this.endpointEnabled('import')) {
      console.warn(
        'Endpoint "import" is disabled. To enable change your environment.ts config',
      );
      return EMPTY;
    }

    return this.getPreSignedUrl(file.name).pipe(
      switchMap((presignedUrl) => {
        console.log('Presigned URL to upload to:', presignedUrl);

        if (!presignedUrl) {
          throw new Error('Presigned URL is undefined or empty');
        }

        return this.http.put(presignedUrl, file, {
          headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-Type': 'text/csv',
          },
        });
      }),
    );
  }

  private getPreSignedUrl(fileName: string): Observable<string> {
    const url = this.getUrl('import', 'import');

    return this.http.get<PreSignedUrlResponse | string>(url, {
      params: {
        name: fileName,
      },
    }).pipe(
      map((response) => {
        console.log('API Response:', response);
        console.log('Response type:', typeof response);

        // Handle different response formats
        if (typeof response === 'string') {
          // Response is a plain string URL
          console.log('Response is a string URL:', response);
          return response;
        } else if (response && typeof response === 'object') {
          // Response is an object, try to extract URL
          const extractedUrl = response.signedUrl || response.url || response.uploadUrl;
          console.log('Extracted URL from object:', extractedUrl);

          if (!extractedUrl) {
            console.error('Could not find URL in response object:', response);
            throw new Error('URL not found in API response');
          }

          return extractedUrl;
        } else {
          console.error('Unexpected response format:', response);
          throw new Error('Invalid response format from API');
        }
      })
    );
  }
}
