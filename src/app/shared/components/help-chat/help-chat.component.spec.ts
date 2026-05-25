import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HelpChatComponent } from './help-chat.component';

describe('HelpChatComponent', () => {
  let fixture: ComponentFixture<HelpChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpChatComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(HelpChatComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
